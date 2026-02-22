import { Request, Response } from "express";
import { GetArticleService } from "../../services/Article/GetArticleService";

class GetArticleController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const getArticleService = new GetArticleService();

    const article = await getArticleService.execute({
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

export { GetArticleController };
