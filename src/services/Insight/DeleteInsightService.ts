import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface InsightRequest {
  id: string;
  userId: string;
}

class DeleteInsightService {
  async execute({ id, userId }: InsightRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }

    const insight = await prismaClient.insight.findUnique({
      where: { id },
    });

    if (!insight) {
      throw new Error("Insight não encontrado");
    }

    if (insight.photo) {
      const s3Storage = new S3Storage();
      await s3Storage.deleteFile(insight.photo);
    }

    const deletedInsight = await prismaClient.insight.delete({
      where: {
        id,
      },
    });

    return deletedInsight;
  }
}

export { DeleteInsightService };
