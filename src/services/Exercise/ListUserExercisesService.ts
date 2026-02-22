import prismaClient from "../../prisma";

interface ExercisesRequest {
  userId: string;
  phase: "MENSTRUAL" | "FOLICULAR" | "OVULATORIA" | "LUTEA";
  language: string;
}

class ListUserExercisesService {
  async execute({ userId, language, phase }: ExercisesRequest) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const exercises = await prismaClient.exercise.findMany({
      where: {
        phase: phase || user.phase,
        language: language || "PT-br",
      },
      orderBy: {
        title: "asc",
      },
      include: {
        contents: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return exercises;
  }
}

export { ListUserExercisesService };
