import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface NutritionRequest {
  type: string;
  order: number;
  nutrition_id: string;
  file: string;
  userId: string;
}

class CreateContentNutritionService {
  async execute({ nutrition_id, userId, file, order, type }: NutritionRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }
    const nutrition = await prismaClient.nutrition.findUnique({
      where: { id: nutrition_id },
    });

    if (!nutrition) {
      throw new Error("Nutrição não encontrada");
    }

    if (type == "IMAGE" || type == "VIDEO") {
      const s3Storage = new S3Storage();
      const upload = await s3Storage.saveFile(file);
      const createdContentNutrition =
        await prismaClient.nutritionContent.create({
          data: {
            value: upload,
            type: type,
            nutrition_id: nutrition_id,
            order: order,
          },
        });
      return createdContentNutrition;
    }
  }
}

export { CreateContentNutritionService };
