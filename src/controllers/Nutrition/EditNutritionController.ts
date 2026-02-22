import { Request, Response } from "express";
import { EditNutritionService } from "../../services/Nutrition/EditNutritionService";

class EditNutritionController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const {
      title,
      meal_type,
      calories,
      duration,
      phase,
      active,
      contents,
      contentsDelete,
    } = req.body;

    let photo = "";

    const userId = req.userId;

    if (req.file) {
      photo = req.file.filename;
    }

    const editNutritionService = new EditNutritionService();

    const nutrition = await editNutritionService.execute({
      id,
      title,
      meal_type,
      calories,
      photo,
      duration,
      phase,
      active,
      userId,
      contents: JSON.parse(contents) || [],
      contentsDelete: JSON.parse(contentsDelete) || [],
    });

    return res.json(nutrition);
  }
}

export { EditNutritionController };
