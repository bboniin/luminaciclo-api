import {
  differenceInDays,
  addDays,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import prismaClient from "../../prisma";
import { Phase } from "@prisma/client";

interface CicleRequest {
  userId: string;
}

class RecalculateCycleService {
  async execute({ userId }: CicleRequest) {
    const user = await prismaClient.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Usuário não encontrado");

    const menstruations = await prismaClient.menstruation.findMany({
      where: { user_id: userId },
      orderBy: { date: "asc" },
    });

    await prismaClient.cycle.deleteMany({ where: { user_id: userId } });
    if (menstruations.length === 0) return user;

    const cyclesToCreate = [];

    // --- IDENTIFICAÇÃO DOS BLOCOS (REGRA DO GAP DE 2 DIAS) ---
    for (let i = 0; i < menstruations.length; i++) {
      const current = menstruations[i];
      const prev = menstruations[i - 1];

      const isNewCycle =
        !prev ||
        differenceInDays(
          startOfDay(new Date(current.date)),
          startOfDay(new Date(prev.date)),
        ) > 2;

      if (isNewCycle) {
        cyclesToCreate.push({
          start_date: current.date,
          last_date: current.date,
        });
      } else {
        cyclesToCreate[cyclesToCreate.length - 1].last_date = current.date;
      }
    }

    // --- SALVAMENTO E CÁLCULO DA AMPLITUDE ---
    for (let i = 0; i < cyclesToCreate.length; i++) {
      const current = cyclesToCreate[i];
      const next = cyclesToCreate[i + 1];

      const amplitudeMenstrual =
        differenceInDays(
          startOfDay(new Date(current.last_date)),
          startOfDay(new Date(current.start_date)),
        ) + 1;

      let totalDuration = null;
      let end_date = null;

      if (next) {
        totalDuration = differenceInDays(
          startOfDay(new Date(next.start_date)),
          startOfDay(new Date(current.start_date)),
        );
        end_date = addDays(new Date(next.start_date), -1);
      }

      await prismaClient.cycle.create({
        data: {
          user_id: userId,
          start_date: current.start_date,
          end_date: end_date,
          duration: totalDuration,
          menstrual_days: amplitudeMenstrual,
        },
      });
    }

    // --- MÉDIAS (Últimos 6) ---
    const lastSixCycles = await prismaClient.cycle.findMany({
      where: { user_id: userId, duration: { not: null } },
      orderBy: { start_date: "desc" },
      take: 6,
    });

    const days_cycle =
      lastSixCycles.length > 0
        ? Math.round(
            lastSixCycles.reduce((acc, c) => acc + (c.duration || 0), 0) /
              lastSixCycles.length,
          )
        : 28;

    const days_menstruation =
      lastSixCycles.length > 0
        ? Math.round(
            lastSixCycles.reduce((acc, c) => acc + (c.menstrual_days || 0), 0) /
              lastSixCycles.length,
          )
        : 5;

    // --- FASE ATUAL E DATA DE INÍCIO ---
    const latestCycle = await prismaClient.cycle.findFirst({
      where: { user_id: userId },
      orderBy: { start_date: "desc" },
    });

    let currentPhase = "MENSTRUAL";
    let startCycleDate = null; // Variável para armazenar a data de início

    if (latestCycle) {
      const today = startOfDay(new Date());
      const startDate = startOfDay(new Date(latestCycle.start_date));
      startCycleDate = startDate; // Atribuímos a data de início do ciclo mais recente

      const x = latestCycle.menstrual_days || days_menstruation;

      const endMenstrual = addDays(startDate, x - 1);
      const endFolicular = addDays(startDate, 13);
      const endOVULATORIA = addDays(endFolicular, 3);

      if (isWithinInterval(today, { start: startDate, end: endMenstrual })) {
        currentPhase = "MENSTRUAL";
      } else if (
        isWithinInterval(today, {
          start: addDays(endMenstrual, 1),
          end: endFolicular,
        })
      ) {
        currentPhase = "FOLICULAR";
      } else if (
        isWithinInterval(today, {
          start: addDays(endFolicular, 1),
          end: endOVULATORIA,
        })
      ) {
        currentPhase = "OVULATORIA";
      } else {
        currentPhase = "LUTEA";
      }
    }

    const userEdited = await prismaClient.user.update({
      where: { id: userId },
      data: {
        days_cycle: days_cycle,
        days_menstruation: days_menstruation,
        phase: currentPhase as Phase,
        start_cycle: startCycleDate,
      },
      select: {
        phase: true,
        days_cycle: true,
        days_menstruation: true,
        start_cycle: true,
      },
    });

    const total_cycles = await prismaClient.cycle.count({
      where: {
        user_id: user.id,
      },
    });

    return { ...userEdited, total_cycles: total_cycles };
  }
}

export { RecalculateCycleService };
