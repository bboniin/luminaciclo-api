import prismaClient from "../../prisma";

interface ExercisesRequest {
  page: number;
  userId: string;
  language: string;
}

class ListExercisesService {
  async execute({ page, userId, language }: ExercisesRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }
    const exercisesTotal = await prismaClient.exercise.count({
      where: {
        language: language || "PT-br",
      },
    });

    const exercises = await prismaClient.exercise.findMany({
      where: {
        language: language || "PT-br",
      },
      skip: page * 30,
      take: 30,
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

    return { exercises, exercisesTotal };
  }
}

export { ListExercisesService };
