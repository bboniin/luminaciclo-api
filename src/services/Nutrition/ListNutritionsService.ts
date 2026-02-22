import prismaClient from "../../prisma";

interface NutritionsRequest {
  page: number;
  userId: string;
  language: string;
}

class ListNutritionsService {
  async execute({ page, userId, language }: NutritionsRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }
    const nutritionsTotal = await prismaClient.nutrition.count({
      where: {
        language: language || "PT-br",
      },
    });

    const nutritions = await prismaClient.nutrition.findMany({
      where: {
        language: language || "PT-br",
      },
      skip: page * 30,
      take: 30,
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

    return { nutritions, nutritionsTotal };
  }
}

export { ListNutritionsService };
