import { Request, Response } from "express";
import { GetExerciseService } from "../../services/Exercise/GetExerciseService";

class GetExerciseController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const getExerciseService = new GetExerciseService();

    const exercise = await getExerciseService.execute({
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

export { GetExerciseController };
