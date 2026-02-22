import { Request, Response } from "express";
import { ListNutritionsService } from "../../services/Nutrition/ListNutritionsService";

class ListNutritionsController {
  async handle(req: Request, res: Response) {
    const { page, language } = req.query;

    const userId = req.userId;

    const listNutritionsService = new ListNutritionsService();

    const nutritions = await listNutritionsService.execute({
      page: Number(page || 0),
      language: String(language || ""),
      userId: userId,
    });

    nutritions.nutritions.map((article) => {
      if (article["photo"]) {
        article["photo_url"] =
          "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
          article["photo"];
      }
    });
    return res.json(nutritions);
  }
}

export { ListNutritionsController };
