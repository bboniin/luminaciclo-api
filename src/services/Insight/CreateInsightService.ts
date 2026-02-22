import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface InsightRequest {
  title: string;
  description: string;
  photo: string;
  phase: "MENSTRUAL" | "FOLICULAR" | "OVULATORIA" | "LUTEA";
  language: string;
  session: string;
  userId: string;
}

class CreateInsightService {
  async execute({
    title,
    description,
    photo,
    phase,
    language,
    session,
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
    if (!title || !description || !photo) {
      throw new Error("Preencha todos os campos são obrigatórios");
    }

    let data = {
      title,
      description,
      phase,
      session,
      language,
      photo: "",
    };

    if (photo) {
      const s3Storage = new S3Storage();
      const upload = await s3Storage.saveFile(photo);
      data.photo = upload;
    }

    const insight = await prismaClient.insight.create({
      data,
    });

    return insight;
  }
}

export { CreateInsightService };
