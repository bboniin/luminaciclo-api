import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ArticleRequest {
  id: string;
  title: string;
  title_photo: string;
  session: string;
  photo: string;
  language: string;
  active: boolean;
  userId: string;
  contents: Array<{
    id: string;
    value: string;
    order: number;
    type: "TEXT" | "TITLE" | "VIDEO" | "IMAGE";
  }>;
  contentsDelete: Array<string>;
}

class EditArticleService {
  async execute({
    id,
    title,
    session,
    title_photo,
    photo,
    active,
    contents,
    contentsDelete,
    userId,
  }: ArticleRequest) {
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
    });

    if (!article) {
      throw new Error("Artigo não encontrado");
    }

    let data = {
      title,
      session,
      title_photo,
      active,
    };

    const s3Storage = new S3Storage();

    if (photo) {
      if (article.photo) {
        await s3Storage.deleteFile(article.photo);
      }
      const upload = await s3Storage.saveFile(photo);
      data["photo"] = upload;
    }

    const updatedArticle = await prismaClient.article.update({
      where: { id },
      data,
    });

    Promise.all(
      contents.map(async (item) => {
        if (item.id) {
          await prismaClient.articleContent.update({
            where: {
              id: item.id,
            },
            data: {
              order: item.order,
              value: item.value,
            },
          });
        } else {
          await prismaClient.articleContent.create({
            data: {
              order: item.order,
              value: item.value,
              type: item.type,
              article_id: id,
            },
          });
        }
      }),
    );

    Promise.all(
      contentsDelete.map(async (item) => {
        const articleContentDelete = await prismaClient.articleContent.delete({
          where: {
            id: item,
          },
        });

        if (
          articleContentDelete.type == "VIDEO" ||
          articleContentDelete.type == "IMAGE"
        ) {
          await s3Storage.deleteFile(articleContentDelete.value);
        }
      }),
    );

    return updatedArticle;
  }
}

export { EditArticleService };
