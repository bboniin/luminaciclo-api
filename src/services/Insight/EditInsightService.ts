import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface InsightRequest {
  id: string;
  title: string;
  description: string;
  photo: string;
  phase: "MENSTRUAL" | "FOLICULAR" | "OVULATORIA" | "LUTEA";
  session: string;
  active: boolean;
  userId: string;
}

class EditInsightService {
  async execute({
    id,
    title,
    description,
    photo,
    session,
    phase,
    active,
    userId,
  }: InsightRequest) {
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

    let data = {
      title,
      description,
      phase,
      active,
      session,
    };

    const s3Storage = new S3Storage();

    if (photo) {
      if (insight.photo) {
        await s3Storage.deleteFile(insight.photo);
      }
      const upload = await s3Storage.saveFile(photo);
      data["photo"] = upload;
    }

    const updatedInsight = await prismaClient.insight.update({
      where: { id },
      data,
    });

    return updatedInsight;
  }
}

export { EditInsightService };
