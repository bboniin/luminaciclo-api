import { Request, Response } from "express";
import { GetUserArticleService } from "../../services/Article/GetUserArticleService";

class GetUserArticleController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const getUserArticleService = new GetUserArticleService();

    const article = await getUserArticleService.execute({
      id,
    });

    if (article["photo"]) {
      article["photo_url"] =
        "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
        article["photo"];
    }

    article.contents.map((content) => {
      if (content.type == "VIDEO" || content.type == "IMAGE") {
        content["value_url"] =
          "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
          content["value"];
      }
    });
    return res.json(article);
  }
}

export { GetUserArticleController };
