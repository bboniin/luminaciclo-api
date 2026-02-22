import { Request, Response } from "express";
import { CreateContentExerciseService } from "../../services/Exercise/CreateContentExerciseService";

class CreateContentExerciseController {
  async handle(req: Request, res: Response) {
    const { type, order, exercise_id } = req.body;

    let file = "";

    const userId = req.userId;

    if (req.file) {
      file = req.file.filename;
    }

    const createContentExerciseService = new CreateContentExerciseService();

    const exercise = await createContentExerciseService.execute({
      type,
      order: parseInt(order),
      file,
      userId,
      exercise_id,
    });

    return res.json(exercise);
  }
}

export { CreateContentExerciseController };
