import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ExerciseRequest {
  id: string;
  title: string;
  description: string;
  duration: string;
  photo: string;
  phase: "MENSTRUAL" | "FOLICULAR" | "OVULATORIA" | "LUTEA";
  intensity: string;
  language: string;
  body_part: string;
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

class EditExerciseService {
  async execute({
    id,
    title,
    description,
    photo,
    phase,
    language,
    duration,
    intensity,
    body_part,
    active,
    contents,
    contentsDelete,
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
    const exercise = await prismaClient.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      throw new Error("Exercício não encontrado");
    }

    let data = {
      title,
      description,
      duration,
      phase,
      intensity,
      language,
      body_part,
      active,
    };

    const s3Storage = new S3Storage();

    if (photo) {
      if (exercise.photo) {
        await s3Storage.deleteFile(exercise.photo);
      }
      const upload = await s3Storage.saveFile(photo);
      data["photo"] = upload;
    }

    const updatedExercise = await prismaClient.exercise.update({
      where: { id },
      data,
    });

    Promise.all(
      contents.map(async (item) => {
        if (item.id) {
          await prismaClient.exerciseContent.update({
            where: {
              id: item.id,
            },
            data: {
              order: item.order,
              value: item.value,
            },
          });
        } else {
          await prismaClient.exerciseContent.create({
            data: {
              order: item.order,
              value: item.value,
              type: item.type,
              exercise_id: id,
            },
          });
        }
      }),
    );

    Promise.all(
      contentsDelete.map(async (item) => {
        const exerciseContentDelete = await prismaClient.exerciseContent.delete(
          {
            where: {
              id: item,
            },
          },
        );

        if (
          exerciseContentDelete.type == "VIDEO" ||
          exerciseContentDelete.type == "IMAGE"
        ) {
          await s3Storage.deleteFile(exerciseContentDelete.value);
        }
      }),
    );

    return updatedExercise;
  }
}

export { EditExerciseService };
