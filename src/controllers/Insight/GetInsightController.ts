import { Request, Response } from "express";
import { GetInsightService } from "../../services/Insight/GetInsightService";

class GetInsightController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const getInsightService = new GetInsightService();

    const insight = await getInsightService.execute({
      id,
    });

    if (insight["photo"]) {
      insight["photo_url"] =
        "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
        insight["photo"];
    }

    return res.json(insight);
  }
}

export { GetInsightController };
