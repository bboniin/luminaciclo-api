import { Request, Response } from "express";
import { DeleteNutritionService } from "../../services/Nutrition/DeleteNutritionService";

class DeleteNutritionController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const userId = req.userId;

    const deleteNutritionService = new DeleteNutritionService();

    const nutrition = await deleteNutritionService.execute({
      id,
      userId,
    });

    return res.json(nutrition);
  }
}

export { DeleteNutritionController };
