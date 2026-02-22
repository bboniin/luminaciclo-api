import prismaClient from "../../prisma";

interface NutritionRequest {
  id: string;
}

class GetUserNutritionService {
  async execute({ id }: NutritionRequest) {
    const nutrition = await prismaClient.nutrition.findUnique({
      where: {
        id,
      },
      include: {
        contents: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!nutrition) {
      throw new Error("Nutrição não encontrada");
    }

    return nutrition;
  }
}

export { GetUserNutritionService };
