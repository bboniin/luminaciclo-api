import { Request, Response } from "express";
import { CreateExerciseService } from "../../services/Exercise/CreateExerciseService";

class CreateExerciseController {
  async handle(req: Request, res: Response) {
    const {
      title,
      description,
      duration,
      intensity,
      body_part,
      phase,
      language,
      contents,
    } = req.body;

    let photo = "";

    const userId = req.userId;

    if (req.file) {
      photo = req.file.filename;
    }

    const createExerciseService = new CreateExerciseService();

    const exercise = await createExerciseService.execute({
      title,
      description,
      duration,
      intensity,
      body_part,
      photo,
      phase,
      contents: JSON.parse(contents) || [],
      language,
      userId,
    });

    return res.json(exercise);
  }
}

export { CreateExerciseController };
