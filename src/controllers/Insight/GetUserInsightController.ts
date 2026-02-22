import { Request, Response } from "express";
import { GetUserInsightService } from "../../services/Insight/GetUserInsightService";

class GetUserInsightController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const userId = req.userId;

    const getUserInsightService = new GetUserInsightService();

    const insight = await getUserInsightService.execute({
      id,
      userId,
    });

    if (insight["photo"]) {
      insight["photo_url"] =
        "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
        insight["photo"];
    }

    return res.json(insight);
  }
}

export { GetUserInsightController };
