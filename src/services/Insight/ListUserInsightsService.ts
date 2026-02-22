import prismaClient from "../../prisma";

interface InsightsRequest {
  userId: string;
  language: string;
}

class ListUserInsightsService {
  async execute({ userId, language }: InsightsRequest) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const insights = await prismaClient.insight.findMany({
      where: {
        phase: user.phase,
        language: language || "PT-br",
      },
      orderBy: {
        title: "asc",
      },
    });

    return insights;
  }
}

export { ListUserInsightsService };
