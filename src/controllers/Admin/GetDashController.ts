import { Request, Response } from "express";
import { GetDashService } from "../../services/Admin/GetDashService";

class GetDashController {
  async handle(req: Request, res: Response) {
    const { date_start, date_end } = req.query;

    const userId = req.userId;

    const getDashService = new GetDashService();

    const users = await getDashService.execute({
      date_start: date_start ? String(date_start) : "",
      date_end: date_end ? String(date_end) : "",
      userId,
    });

    return res.json(users);
  }
}

export { GetDashController };
