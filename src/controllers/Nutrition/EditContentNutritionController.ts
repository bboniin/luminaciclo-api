import { Request, Response } from "express";
import { EditContentNutritionService } from "../../services/Nutrition/EditContentNutritionService";

class EditContentNutritionController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { order } = req.body;

    let file = "";
    if (req.file) {
      file = req.file.filename;
    }
    const userId = req.userId;

    const editContentNutritionService = new EditContentNutritionService();

    const nutrition = await editContentNutritionService.execute({
      id,
      order: parseInt(order),
      file,
      userId,
    });

    return res.json(nutrition);
  }
}

export { EditContentNutritionController };
