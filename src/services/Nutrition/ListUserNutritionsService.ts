import prismaClient from "../../prisma";

interface NutritionsRequest {
  userId: string;
  language: string;
  phase: "MENSTRUAL" | "FOLICULAR" | "OVULATORIA" | "LUTEA";
}

class ListUserNutritionsService {
  async execute({ userId, phase, language }: NutritionsRequest) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const nutritions = await prismaClient.nutrition.findMany({
      where: {
        phase: phase || user.phase,
        language: language || "PT-br",
      },
      orderBy: {
        title: "asc",
      },
      include: {
        contents: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return nutritions;
  }
}

export { ListUserNutritionsService };
