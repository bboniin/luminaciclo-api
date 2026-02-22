import { Request, Response } from "express";
import { ListInsightsService } from "../../services/Insight/ListInsightsService";

class ListInsightsController {
  async handle(req: Request, res: Response) {
    const { page, language } = req.query;

    const userId = req.userId;

    const listInsightsService = new ListInsightsService();

    const insights = await listInsightsService.execute({
      page: Number(page || 0),
      language: String(language || ""),
      userId: userId,
    });

    insights.insights.map((insight) => {
      if (insight["photo"]) {
        insight["photo_url"] =
          "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" +
          insight["photo"];
      }
    });

    return res.json(insights);
  }
}

export { ListInsightsController };
