import { Request, Response } from "express";
import { GetUserNutritionService } from "../../services/Nutrition/GetUserNutritionService";

class GetUserNutritionController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const getUserNutritionService = new GetUserNutritionService();

    const nutrition = await getUserNutritionService.execute({
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

export { GetUserNutritionController };
