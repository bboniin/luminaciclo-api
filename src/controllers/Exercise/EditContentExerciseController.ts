import { Request, Response } from "express";
import { EditContentExerciseService } from "../../services/Exercise/EditContentExerciseService";

class EditContentExerciseController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { value, order } = req.body;

    let file = "";

    const userId = req.userId;

    if (req.file) {
      file = req.file.filename;
    }

    const editContentExerciseService = new EditContentExerciseService();

    const exercise = await editContentExerciseService.execute({
      id,
      order: parseInt(order),
      file,
      userId,
    });

    return res.json(exercise);
  }
}

export { EditContentExerciseController };
