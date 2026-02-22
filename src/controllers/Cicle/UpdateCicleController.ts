import { Request, Response } from "express";
import { UpdateCicleService } from "../../services/Cicle/UpdateCicleService";
import { RecalculateCycleService } from "../../services/Cicle/RecalculateCycleService";

class UpdateCicleController {
  async handle(req: Request, res: Response) {
    const { days_cycle, days_menstruation, menstruations } = req.body;
    const userId = req.userId;

    const updateCicleService = new UpdateCicleService();

    const cicle = await updateCicleService.execute({
      userId,
      days_cycle,
      days_menstruation,
      menstruations,
    });

    if (menstruations) {
      const recalculateCycleService = new RecalculateCycleService();
      await recalculateCycleService.execute({
        userId,
      });
    }

    return res.json(cicle);
  }
}

export { UpdateCicleController };
