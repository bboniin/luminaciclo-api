import prismaClient from "../../prisma";

interface InsightRequest {
  id: string;
}

class GetInsightService {
  async execute({ id }: InsightRequest) {
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

export { GetInsightService };
