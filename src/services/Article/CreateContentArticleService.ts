import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ArticleRequest {
  type: string;
  order: number;
  article_id: string;
  file: string;
  userId: string;
}

class CreateContentArticleService {
  async execute({ article_id, userId, file, order, type }: ArticleRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }
    const article = await prismaClient.article.findUnique({
      where: { id: article_id },
    });

    if (!article) {
      throw new Error("Artigo não encontrado");
    }

    if (type == "IMAGE" || type == "VIDEO") {
      const s3Storage = new S3Storage();
      const upload = await s3Storage.saveFile(file);

      const createdContentArticle = await prismaClient.articleContent.create({
        data: {
          value: upload,
          type: type,
          article_id: article_id,
          order: order,
        },
      });
      return createdContentArticle;
    }
  }
}

export { CreateContentArticleService };
