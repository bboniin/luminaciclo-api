import { Request, Response } from "express";
import { ListArticlesService } from "../../services/Article/ListArticlesService";

class ListArticlesController {
  async handle(req: Request, res: Response) {
    const { page, language } = req.query;

    const userId = req.userId;

    const listArticlesService = new ListArticlesService();

    const articles = await listArticlesService.execute({
      page: Number(page || 0),
      language: String(language || ""),
      userId: userId,
    });

    articles.articles.map((article) => {
      if (article["photo"]) {
        article["photo_url"] =
          "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
          article["photo"];
      }
    });

    return res.json(articles);
  }
}

export { ListArticlesController };
