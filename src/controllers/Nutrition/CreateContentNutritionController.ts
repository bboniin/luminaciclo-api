import { Request, Response } from "express";
import { CreateContentNutritionService } from "../../services/Nutrition/CreateContentNutritionService";

class CreateContentNutritionController {
  async handle(req: Request, res: Response) {
    const { type, order, nutrition_id } = req.body;

    let file = "";
    if (req.file) {
      file = req.file.filename;
    }

    const userId = req.userId;

    const createContentNutritionService = new CreateContentNutritionService();

    const nutrition = await createContentNutritionService.execute({
      type,
      order: parseInt(order),
      file,
      userId,
      nutrition_id,
    });

    return res.json(nutrition);
  }
}

export { CreateContentNutritionController };
