import prismaClient from "../../prisma";

interface InsightRequest {
  id: string;
  userId: string;
}

class GetUserInsightService {
  async execute({ id, userId }: InsightRequest) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const insight = await prismaClient.insight.findUnique({
      where: {
        id,
      },
    });

    if (!insight) {
      throw new Error("Insight não encontrado");
    }

    return insight;
  }
}

export { GetUserInsightService };
