import { Request, Response } from "express";
import { GetMenstruationService } from "../../services/Cicle/GetMenstruationService";

class GetMenstruationController {
  async handle(req: Request, res: Response) {
    const user_id = req.userId;

    const getMenstruationService = new GetMenstruationService();

    const menstruations = await getMenstruationService.execute({
      user_id,
    });

    return res.json(menstruations);
  }
}

export { GetMenstruationController };
