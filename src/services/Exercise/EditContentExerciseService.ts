import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ExerciseRequest {
  id: string;
  file: string;
  order: number;
  userId: string;
}

class EditContentExerciseService {
  async execute({ id, userId, file, order }: ExerciseRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }
    const exerciseContent = await prismaClient.exerciseContent.findUnique({
      where: { id },
    });

    if (!exerciseContent) {
      throw new Error("Conteúdo do Exercício não encontrado");
    }

    if (exerciseContent.type == "IMAGE" || exerciseContent.type == "VIDEO") {
      if (file) {
        const s3Storage = new S3Storage();
        await s3Storage.deleteFile(exerciseContent.value);
        file = await s3Storage.saveFile(file);
      }

      const updatedContentExercise = await prismaClient.exerciseContent.update({
        where: { id },
        data: {
          value: file || exerciseContent.value,
          order: order,
        },
      });
      return updatedContentExercise;
    }
  }
}

export { EditContentExerciseService };
