import prismaClient from "../../prisma";

interface ArticleRequest {
  id: string;
}

class GetArticleService {
  async execute({ id }: ArticleRequest) {
    const article = await prismaClient.article.findUnique({
      where: {
        id,
      },
      include: {
        contents: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!article) {
      throw new Error("Artigo não encontrado");
    }

    return article;
  }
}

export { GetArticleService };
