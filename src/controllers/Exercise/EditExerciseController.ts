import { Request, Response } from "express";
import { EditExerciseService } from "../../services/Exercise/EditExerciseService";

class EditExerciseController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const {
      title,
      description,
      duration,
      intensity,
      body_part,
      phase,
      language,
      active,
      contents,
      contentsDelete,
    } = req.body;
    let photo = "";

    const userId = req.userId;

    if (req.file) {
      photo = req.file.filename;
    }

    const editExerciseService = new EditExerciseService();

    const exercise = await editExerciseService.execute({
      id,
      title,
      description,
      duration,
      intensity,
      body_part,
      photo,
      phase,
      language,
      active,
      userId,
      contents: JSON.parse(contents) || [],
      contentsDelete: JSON.parse(contentsDelete) || [],
    });

    return res.json(exercise);
  }
}

export { EditExerciseController };
