import { endOfDay, startOfDay } from "date-fns";
import prismaClient from "../../prisma";

interface CicleRequest {
  userId: string;
  menstruations?: Array<Date>;
  menstruations_remove?: Array<string>;
}

class RegisterMenstruationService {
  async execute({ userId, menstruations_remove, menstruations }: CicleRequest) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    await Promise.all(
      menstruations_remove.map(async (item) => {
        await prismaClient.menstruation.delete({
          where: {
            id: item,
          },
        });
      }),
    );

    let menstruationsCreate = [];

    await Promise.all(
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
          const menstruationCreate = await prismaClient.menstruation.create({
            data: {
              date: new Date(date),
              user_id: userId,
            },
          });

          menstruationsCreate.push(menstruationCreate);
        }
      }),
    );

    return menstruationsCreate;
  }
}

export { RegisterMenstruationService };
