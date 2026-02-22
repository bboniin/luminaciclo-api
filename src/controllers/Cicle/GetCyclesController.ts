import { Request, Response } from "express";
import { GetCyclesService } from "../../services/Cicle/GetCyclesService";

class GetCyclesController {
  async handle(req: Request, res: Response) {
    const user_id = req.userId;

    const getCyclesService = new GetCyclesService();

    const cicle = await getCyclesService.execute({
      user_id,
    });

    return res.json(cicle);
  }
}

export { GetCyclesController };
