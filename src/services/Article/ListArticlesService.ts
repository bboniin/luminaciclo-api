import prismaClient from "../../prisma";

interface ArticlesRequest {
  page: number;
  userId: string;
  language: string;
}

class ListArticlesService {
  async execute({ page, userId, language }: ArticlesRequest) {
    const admin = await prismaClient.admin.findUnique({
      where: {
        id: userId,
      },
    });
    if (!admin) {
      throw new Error("Usuário não encontrado");
    }
    const articlesTotal = await prismaClient.article.count({
      where: {
        language: language || "PT-br",
      },
    });

    const articles = await prismaClient.article.findMany({
      where: {
        language: language || "PT-br",
      },
      skip: page * 30,
      take: 30,
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

    return { articles, articlesTotal };
  }
}

export { ListArticlesService };
