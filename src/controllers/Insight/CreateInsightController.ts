import { Request, Response } from "express";
import { CreateInsightService } from "../../services/Insight/CreateInsightService";

class CreateInsightController {
  async handle(req: Request, res: Response) {
    const { title, description, phase, session, language } = req.body;

    const userId = req.userId;

    let photo = "";

    if (req.file) {
      photo = req.file.filename;
    }

    const createInsightService = new CreateInsightService();

    const insight = await createInsightService.execute({
      title,
      description,
      photo,
      phase,
      language,
      session,
      userId,
    });

    return res.json(insight);
  }
}

export { CreateInsightController };
