import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface NutritionRequest {
  title: string;
  duration: string;
  meal_type: string;
  calories: string;
  photo: string;
  phase: "MENSTRUAL" | "FOLICULAR" | "OVULATORIA" | "LUTEA";
  language: string;
  userId: string;
  contents: Array<{
    value: string;
    order: number;
    type: "TEXT" | "TITLE" | "VIDEO" | "IMAGE";
  }>;
}

class CreateNutritionService {
  async execute({
    title,
    duration,
    calories,
    meal_type,
    photo,
    phase,
    language,
    userId,
    contents,
  }: NutritionRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }
    if (!title || !calories || !duration || !meal_type || !photo) {
      throw new Error("Preencha todos os campos são obrigatórios");
    }

    let data = {
      title,
      calories,
      duration,
      meal_type,
      phase,
      language,
      photo: "",
    };

    if (photo) {
      const s3Storage = new S3Storage();
      const upload = await s3Storage.saveFile(photo);
      data.photo = upload;
    }

    const nutrition = await prismaClient.nutrition.create({
      data,
    });

    Promise.all(
      contents.map(async (item) => {
        await prismaClient.nutritionContent.create({
          data: {
            order: item.order,
            value: item.value,
            type: item.type,
            nutrition_id: nutrition.id,
          },
        });
      }),
    );

    return nutrition;
  }
}

export { CreateNutritionService };
