import { Request, Response } from "express";
import { CreateNutritionService } from "../../services/Nutrition/CreateNutritionService";

class CreateNutritionController {
  async handle(req: Request, res: Response) {
    const { title, meal_type, calories, duration, phase, language, contents } =
      req.body;

    let photo = "";

    const userId = req.userId;

    if (req.file) {
      photo = req.file.filename;
    }

    const createNutritionService = new CreateNutritionService();

    const nutrition = await createNutritionService.execute({
      title,
      meal_type,
      calories,
      duration,
      photo,
      phase,
      language,
      userId,
      contents: JSON.parse(contents) || [],
    });

    return res.json(nutrition);
  }
}

export { CreateNutritionController };
