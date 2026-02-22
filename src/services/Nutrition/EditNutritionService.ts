import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface NutritionRequest {
  id: string;
  title: string;
  duration: string;
  meal_type: string;
  calories: string;
  photo: string;
  phase: "MENSTRUAL" | "FOLICULAR" | "OVULATORIA" | "LUTEA";
  active: boolean;
  userId: string;
  contents: Array<{
    id: string;
    value: string;
    order: number;
    type: "TEXT" | "TITLE" | "VIDEO" | "IMAGE";
  }>;
  contentsDelete: Array<string>;
}

class EditNutritionService {
  async execute({
    id,
    title,
    duration,
    calories,
    meal_type,
    photo,
    phase,
    active,
    contents,
    contentsDelete,
    userId,
  }: NutritionRequest) {
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
    });

    if (!nutrition) {
      throw new Error("Nutrição não encontrada");
    }

    let data = {
      title,
      duration,
      calories,
      meal_type,
      phase,
      active,
    };

    const s3Storage = new S3Storage();

    if (photo) {
      if (nutrition.photo) {
        await s3Storage.deleteFile(nutrition.photo);
      }
      const upload = await s3Storage.saveFile(photo);
      data["photo"] = upload;
    }

    const updatedNutrition = await prismaClient.nutrition.update({
      where: { id },
      data,
    });

    Promise.all(
      contents.map(async (item) => {
        if (item.id) {
          await prismaClient.nutritionContent.update({
            where: {
              id: item.id,
            },
            data: {
              order: item.order,
              value: item.value,
            },
          });
        } else {
          await prismaClient.nutritionContent.create({
            data: {
              order: item.order,
              value: item.value,
              type: item.type,
              nutrition_id: id,
            },
          });
        }
      }),
    );

    Promise.all(
      contentsDelete.map(async (item) => {
        const nutritionContentDelete =
          await prismaClient.nutritionContent.delete({
            where: {
              id: item,
            },
          });

        if (
          nutritionContentDelete.type == "VIDEO" ||
          nutritionContentDelete.type == "IMAGE"
        ) {
          await s3Storage.deleteFile(nutritionContentDelete.value);
        }
      }),
    );

    return updatedNutrition;
  }
}

export { EditNutritionService };
