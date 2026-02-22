import { Request, Response } from "express";
import { DeleteExerciseService } from "../../services/Exercise/DeleteExerciseService";

class DeleteExerciseController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const userId = req.userId;

    const deleteExerciseService = new DeleteExerciseService();

    const exercise = await deleteExerciseService.execute({
      id,
      userId,
    });

    return res.json(exercise);
  }
}

export { DeleteExerciseController };
