import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ExerciseRequest {
  id: string;
  userId: string;
}

class DeleteExerciseService {
  async execute({ id, userId }: ExerciseRequest) {
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

    if (exercise.photo) {
      const s3Storage = new S3Storage();
      await s3Storage.deleteFile(exercise.photo);
    }

    await prismaClient.exerciseContent.deleteMany({
      where: {
        exercise_id: id,
      },
    });

    const deletedExercise = await prismaClient.exercise.delete({
      where: {
        id,
      },
    });

    return deletedExercise;
  }
}

export { DeleteExerciseService };
