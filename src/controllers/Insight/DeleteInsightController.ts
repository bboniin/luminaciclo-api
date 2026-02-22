import { Request, Response } from "express";
import { DeleteInsightService } from "../../services/Insight/DeleteInsightService";

class DeleteInsightController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const userId = req.userId;

    const deleteInsightService = new DeleteInsightService();

    const insight = await deleteInsightService.execute({
      id,
      userId,
    });

    return res.json(insight);
  }
}

export { DeleteInsightController };
