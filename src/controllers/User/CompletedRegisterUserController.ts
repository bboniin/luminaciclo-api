import { Request, Response } from "express";
import { CompletedRegisterUserService } from "../../services/User/CompletedRegisterUserService";

class CompletedRegisterUserController {
  async handle(req: Request, res: Response) {
    const { is_menopause, days_cycle, days_menstruation, menstruations } =
      req.body;

    const userId = req.userId;

    const completedRegisterUserService = new CompletedRegisterUserService();

    const user = await completedRegisterUserService.execute({
      is_menopause,
      days_cycle,
      days_menstruation,
      menstruations,
      userId,
    });

    if (user["photo"]) {
      user["photo_url"] =
        "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" + user["photo"];
    }

    return res.json(user);
  }
}

export { CompletedRegisterUserController };
