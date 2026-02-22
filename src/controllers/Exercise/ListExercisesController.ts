import { Request, Response } from "express";
import { ListExercisesService } from "../../services/Exercise/ListExercisesService";

class ListExercisesController {
  async handle(req: Request, res: Response) {
    const { page, language } = req.query;

    const userId = req.userId;

    const listExercisesService = new ListExercisesService();

    const exercises = await listExercisesService.execute({
      page: Number(page || 0),
      language: String(language || ""),
      userId: userId,
    });

    exercises.exercises.map((exercise) => {
      if (exercise["photo"]) {
        exercise["photo_url"] =
          "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
          exercise["photo"];
      }
    });

    return res.json(exercises);
  }
}

export { ListExercisesController };
