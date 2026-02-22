import prismaClient from "../../prisma";
import S3Storage from "../../utils/S3Storage";

interface ArticleRequest {
  title: string;
  title_photo: string;
  session: string;
  photo: string;
  language: string;
  userId: string;
  contents: Array<{
    value: string;
    order: number;
    type: "TEXT" | "TITLE" | "VIDEO" | "IMAGE";
  }>;
}

class CreateArticleService {
  async execute({
    title,
    title_photo,
    session,
    photo,
    language,
    contents,
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
    if (!title || !title_photo || !session || !photo) {
      throw new Error("Preencha todos os campos são obrigatórios");
    }

    let data = {
      title,
      title_photo,
      session,
      language,
      photo: "",
    };

    if (photo) {
      const s3Storage = new S3Storage();
      const upload = await s3Storage.saveFile(photo);
      data.photo = upload;
    }

    const article = await prismaClient.article.create({
      data,
    });

    Promise.all(
      contents.map(async (item) => {
        await prismaClient.articleContent.create({
          data: {
            order: item.order,
            value: item.value,
            type: item.type,
            article_id: article.id,
          },
        });
      }),
    );

    return article;
  }
}

export { CreateArticleService };
