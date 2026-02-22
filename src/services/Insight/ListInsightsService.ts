import prismaClient from "../../prisma";

interface InsightsRequest {
  page: number;
  userId: string;
  language: string;
}

class ListInsightsService {
  async execute({ page, userId, language }: InsightsRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }
    const insightsTotal = await prismaClient.insight.count({
      where: {
        language: language || "PT-br",
      },
    });

    const insights = await prismaClient.insight.findMany({
      where: {
        language: language || "PT-br",
      },
      skip: page * 30,
      take: 30,
      orderBy: {
        title: "asc",
      },
    });

    return { insights, insightsTotal };
  }
}

export { ListInsightsService };
