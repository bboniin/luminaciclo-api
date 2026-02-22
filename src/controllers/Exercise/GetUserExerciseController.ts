import { Request, Response } from "express";
import { GetUserExerciseService } from "../../services/Exercise/GetUserExerciseService";

class GetUserExerciseController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const getUserExerciseService = new GetUserExerciseService();

    const exercise = await getUserExerciseService.execute({
      id,
    });

    if (exercise["photo"]) {
      exercise["photo_url"] =
        "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
        exercise["photo"];
    }

    exercise.contents.map((content) => {
      if (content.type == "VIDEO" || content.type == "IMAGE") {
        content["value_url"] =
          "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
          content["value"];
      }
    });

    return res.json(exercise);
  }
}

export { GetUserExerciseController };
