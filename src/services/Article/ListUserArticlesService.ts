import prismaClient from "../../prisma";

interface ArticlesRequest {
  userId: string;
  language: string;
}

class ListUserArticlesService {
  async execute({ userId, language }: ArticlesRequest) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const articles = await prismaClient.article.findMany({
      where: {
        language: language || "PT-br",
      },
      orderBy: {
        title: "asc",
      },
      include: {
        contents: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return articles;
  }
}

export { ListUserArticlesService };
