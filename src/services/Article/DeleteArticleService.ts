import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ArticleRequest {
  id: string;
  userId: string;
}

class DeleteArticleService {
  async execute({ id, userId }: ArticleRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }

    const article = await prismaClient.article.findUnique({
      where: { id },
      include: {
        contents: true,
      },
    });

    if (!article) {
      throw new Error("Artigo não encontrado");
    }

    const s3Storage = new S3Storage();

    if (article.photo) {
      await s3Storage.deleteFile(article.photo);
    }

    await prismaClient.articleContent.deleteMany({
      where: {
        article_id: id,
      },
    });

    await Promise.all(
      article.contents.map(async (item) => {
        if (item.type == "IMAGE" || item.type == "VIDEO") {
          await s3Storage.deleteFile(item.value);
        }
      }),
    );

    const deletedArticle = await prismaClient.article.delete({
      where: {
        id,
      },
    });

    return deletedArticle;
  }
}

export { DeleteArticleService };
