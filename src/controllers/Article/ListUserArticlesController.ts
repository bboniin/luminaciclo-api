import { Request, Response } from "express";
import { ListUserArticlesService } from "../../services/Article/ListUserArticlesService";

class ListUserArticlesController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    const { language } = req.query;

    const listUserArticlesService = new ListUserArticlesService();

    const articles = await listUserArticlesService.execute({
      userId,
      language: String(language || ""),
    });

    articles.map((article) => {
      if (article["photo"]) {
        article["photo_url"] =
          "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
          article["photo"];
      }
    });

    return res.json(articles);
  }
}

export { ListUserArticlesController };
