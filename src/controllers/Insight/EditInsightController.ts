import { Request, Response } from "express";
import { EditInsightService } from "../../services/Insight/EditInsightService";

class EditInsightController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, phase, session, active } = req.body;

    const userId = req.userId;

    let photo = "";

    if (req.file) {
      photo = req.file.filename;
    }

    const editInsightService = new EditInsightService();

    const insight = await editInsightService.execute({
      id,
      title,
      description,
      photo,
      phase,
      session,
      active,
      userId,
    });

    return res.json(insight);
  }
}

export { EditInsightController };
