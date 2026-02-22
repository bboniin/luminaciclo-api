import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ExerciseRequest {
  title: string;
  description: string;
  duration: string;
  intensity: string;
  body_part: string;
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

class CreateExerciseService {
  async execute({
    title,
    description,
    duration,
    photo,
    phase,
    body_part,
    language,
    intensity,
    contents,
    userId,
  }: ExerciseRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }
    if (!title || !description || !duration || !photo) {
      throw new Error("Preencha todos os campos são obrigatórios");
    }

    let data = {
      title,
      description,
      duration,
      phase,
      body_part,
      language,
      intensity,
      photo: "",
    };

    if (photo) {
      const s3Storage = new S3Storage();
      const upload = await s3Storage.saveFile(photo);
      data.photo = upload;
    }

    const exercise = await prismaClient.exercise.create({
      data,
    });

    Promise.all(
      contents.map(async (item) => {
        await prismaClient.exerciseContent.create({
          data: {
            order: item.order,
            value: item.value,
            type: item.type,
            exercise_id: exercise.id,
          },
        });
      }),
    );
    return exercise;
  }
}

export { CreateExerciseService };
