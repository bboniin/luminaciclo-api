import { sign } from "jsonwebtoken";
import prismaClient from "../../prisma";

interface CicleRequest {
  user_id: string;
}

class GetMenstruationService {
  async execute({ user_id }: CicleRequest) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        days_cycle: true,
        days_menstruation: true,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const menstruations = await prismaClient.menstruation.findMany({
      where: {
        user_id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return menstruations;
  }
}

export { GetMenstruationService };
