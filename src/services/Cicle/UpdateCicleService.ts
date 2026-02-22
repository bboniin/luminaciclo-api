import { endOfDay, startOfDay } from "date-fns";
import prismaClient from "../../prisma";
import { RecalculateCycleService } from "./RecalculateCycleService";

interface CicleRequest {
  userId: string;
  days_cycle?: number;
  days_menstruation?: number;
  menstruations?: Array<Date>;
}

class UpdateCicleService {
  async execute({
    userId,
    days_cycle,
    days_menstruation,
    menstruations,
  }: CicleRequest) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    if (days_cycle || days_menstruation) {
      await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          days_cycle: days_cycle || user.days_cycle,
          days_menstruation: days_menstruation || user.days_menstruation,
        },
      });
    }

    Promise.all(
      menstruations.map(async (date) => {
        const menstruation = await prismaClient.menstruation.findFirst({
          where: {
            date: {
              gte: startOfDay(new Date(date)),
              lte: endOfDay(new Date(date)),
            },
          },
        });
        if (!menstruation) {
          await prismaClient.menstruation.create({
            data: {
              date: new Date(date),
              user_id: userId,
            },
          });
        }
      }),
    );

    return user;
  }
}

export { UpdateCicleService };
