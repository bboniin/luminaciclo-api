import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface NutritionRequest {
  id: string;
  userId: string;
}

class DeleteNutritionService {
  async execute({ id, userId }: NutritionRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }

    const nutrition = await prismaClient.nutrition.findUnique({
      where: { id },
      include: {
        contents: true,
      },
    });

    if (!nutrition) {
      throw new Error("Nutrição não encontrada");
    }

    const s3Storage = new S3Storage();

    if (nutrition.photo) {
      await s3Storage.deleteFile(nutrition.photo);
    }

    await Promise.all(
      nutrition.contents.map(async (item) => {
        if (item.type == "IMAGE" || item.type == "VIDEO") {
          await s3Storage.deleteFile(item.value);
        }
      }),
    );
    await prismaClient.nutritionContent.deleteMany({
      where: {
        nutrition_id: id,
      },
    });

    const deletedNutrition = await prismaClient.nutrition.delete({
      where: {
        id,
      },
    });

    return deletedNutrition;
  }
}

export { DeleteNutritionService };
