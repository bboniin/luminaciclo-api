import { Request, Response } from "express";
import { RegisterMenstruationService } from "../../services/Cicle/RegisterMenstruationService";
import { RecalculateCycleService } from "../../services/Cicle/RecalculateCycleService";

class RegisterMenstruationController {
  async handle(req: Request, res: Response) {
    const { menstruations_remove, menstruations } = req.body;

    const userId = req.userId;

    const registerMenstruationService = new RegisterMenstruationService();

    const menstruationsCreate = await registerMenstruationService.execute({
      userId,
      menstruations_remove,
      menstruations,
    });

    const recalculateCycleService = new RecalculateCycleService();
    const user = await recalculateCycleService.execute({
      userId,
    });

    return res.json({ menstruations: menstruationsCreate, user });
  }
}

export { RegisterMenstruationController };
