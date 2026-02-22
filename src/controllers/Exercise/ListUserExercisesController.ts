import { Request, Response } from "express";
import { ListUserExercisesService } from "../../services/Exercise/ListUserExercisesService";

class ListUserExercisesController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    const { language, phase } = req.query;

    const listUserExercisesService = new ListUserExercisesService();

    const exercises = await listUserExercisesService.execute({
      userId,
      phase: phase as "MENSTRUAL" | "FOLICULAR" | "OVULATORIA" | "LUTEA",
      language: String(language || ""),
    });

    exercises.map((exercise) => {
      if (exercise["photo"]) {
        exercise["photo_url"] =
          "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
          exercise["photo"];
      }
    });

    return res.json(exercises);
  }
}

export { ListUserExercisesController };
