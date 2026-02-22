import prismaClient from "../../prisma";

interface ExerciseRequest {
  id: string;
}

class GetUserExerciseService {
  async execute({ id }: ExerciseRequest) {
    const exercise = await prismaClient.exercise.findUnique({
      where: {
        id,
      },
      include: {
        contents: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!exercise) {
      throw new Error("Exercício não encontrado");
    }

    return exercise;
  }
}

export { GetUserExerciseService };
