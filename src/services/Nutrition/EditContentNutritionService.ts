import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface NutritionRequest {
  id: string;
  file: string;
  order: number;
  userId: string;
}

class EditContentNutritionService {
  async execute({ id, userId, file, order }: NutritionRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }
    const nutritionContent = await prismaClient.nutritionContent.findUnique({
      where: { id },
    });

    if (!nutritionContent) {
      throw new Error("Conteúdo da Nutrição não encontrado");
    }

    if (nutritionContent.type == "IMAGE" || nutritionContent.type == "VIDEO") {
      if (file) {
        const s3Storage = new S3Storage();
        await s3Storage.deleteFile(nutritionContent.value);
        file = await s3Storage.saveFile(file);
      }

      const updatedContentNutrition =
        await prismaClient.nutritionContent.update({
          where: { id },
          data: {
            value: file || nutritionContent.value,
            order: order,
          },
        });
      return updatedContentNutrition;
    }
  }
}

export { EditContentNutritionService };
