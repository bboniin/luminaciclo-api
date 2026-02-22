import prismaClient from "../../prisma";
import { Phase } from "@prisma/client";
import S3Storage from "../../utils/S3Storage";

interface UserRequest {
  days_menstruation: number;
  days_cycle: number;
  is_menopause: boolean;
  menstruations: Array<Date>;
  userId: string;
}

class CompletedRegisterUserService {
  async execute({
    days_menstruation,
    days_cycle,
    menstruations,
    userId,
    is_menopause,
  }: UserRequest) {
    const userGet = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!userGet) {
      throw new Error("Usuário não encontrado");
    }

    if (is_menopause) {
      const user = await prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          is_menopause: true,
        },
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        birthday: user.birthday,
        phone_number: user.phone_number,
        phase: user.phase,
        days_cycle: user.days_cycle,
        days_menstruation: user.days_menstruation,
        plan_name: user.plan_name,
      };
    }

    let phase = Phase.LUTEA;

    const user = await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        days_cycle: days_cycle || 28,
        days_menstruation: days_menstruation || 5,
        phase: phase,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      birthday: user.birthday,
      phone_number: user.phone_number,
      phase: user.phase,
      days_cycle: user.days_cycle,
      days_menstruation: user.days_menstruation,
      start_cycle: user.start_cycle,
      plan_name: user.plan_name,
    };
  }
}

export { CompletedRegisterUserService };
