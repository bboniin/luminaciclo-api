import { Request, Response } from "express";
import { GetNutritionService } from "../../services/Nutrition/GetNutritionService";

class GetNutritionController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const getNutritionService = new GetNutritionService();

    const nutrition = await getNutritionService.execute({
      id,
    });

    if (nutrition["photo"]) {
      nutrition["photo_url"] =
        "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
        nutrition["photo"];
    }

    nutrition.contents.map((content) => {
      if (content.type == "VIDEO" || content.type == "IMAGE") {
        content["value_url"] =
          "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
          content["value"];
      }
    });

    return res.json(nutrition);
  }
}

export { GetNutritionController };
