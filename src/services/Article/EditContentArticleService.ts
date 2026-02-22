import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ArticleRequest {
  id: string;
  file: string;
  order: number;
  userId: string;
}

class EditContentArticleService {
  async execute({ id, userId, file, order }: ArticleRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });

    if (!admin) {
      throw new Error("Usuário não encontrado");
    }

    const articleContent = await prismaClient.articleContent.findUnique({
      where: { id },
    });

    if (!articleContent) {
      throw new Error("Conteúdo do Artigo não encontrado");
    }

    if (articleContent.type == "IMAGE" || articleContent.type == "VIDEO") {
      if (file) {
        const s3Storage = new S3Storage();
        await s3Storage.deleteFile(articleContent.value);
        file = await s3Storage.saveFile(file);
      }

      const updatedContentArticle = await prismaClient.articleContent.update({
        where: { id },
        data: {
          value: file,
          order: order,
        },
      });
      return updatedContentArticle;
    }
  }
}

export { EditContentArticleService };
