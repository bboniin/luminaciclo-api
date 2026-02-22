import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ExerciseRequest {
  type: string;
  order: number;
  exercise_id: string;
  file: string;
  userId: string;
}

class CreateContentExerciseService {
  async execute({ exercise_id, userId, file, order, type }: ExerciseRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }
    const exercise = await prismaClient.exercise.findUnique({
      where: { id: exercise_id },
    });

    if (!exercise) {
      throw new Error("Exercício não encontrado");
    }

    if (type == "IMAGE" || type == "VIDEO") {
      const s3Storage = new S3Storage();
      const upload = await s3Storage.saveFile(file);

      const createdContentExercise = await prismaClient.exerciseContent.create({
        data: {
          value: upload,
          type: type,
          exercise_id: exercise_id,
          order: order,
        },
      });
      return createdContentExercise;
    }
  }
}

export { CreateContentExerciseService };
