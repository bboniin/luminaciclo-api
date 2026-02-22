import { Request, Response } from "express";
import { ListUserInsightsService } from "../../services/Insight/ListUserInsightsService";

class ListUserInsightsController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    const { language } = req.query;

    const listUserInsightsService = new ListUserInsightsService();

    const insights = await listUserInsightsService.execute({
      userId,
      language: String(language || ""),
    });

    insights.map((insight) => {
      if (insight["photo"]) {
        insight["photo_url"] =
          "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
          insight["photo"];
      }
    });

    return res.json(insights);
  }
}

export { ListUserInsightsController };
