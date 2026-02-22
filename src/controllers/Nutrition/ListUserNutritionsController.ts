import { Request, Response } from "express";
import { ListUserNutritionsService } from "../../services/Nutrition/ListUserNutritionsService";

class ListUserNutritionsController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    const { language, phase } = req.query;

    const listUserNutritionsService = new ListUserNutritionsService();

    const nutritions = await listUserNutritionsService.execute({
      userId,
      phase: phase as "MENSTRUAL" | "FOLICULAR" | "OVULATORIA" | "LUTEA",
      language: String(language || ""),
    });

    nutritions.map((article) => {
      if (article["photo"]) {
        article["photo_url"] =
          "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
          article["photo"];
      }
    });

    return res.json(nutritions);
  }
}

export { ListUserNutritionsController };
