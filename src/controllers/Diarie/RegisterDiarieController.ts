import { Request, Response } from "express";
import { RegisterDiarieService } from "../../services/Diarie/RegisterDiarieService";

class RegisterDiarieController {
  async handle(req: Request, res: Response) {
    const { message, symptoms, date } = req.body;
    const user_id = req.userId;

    const registerDiarieService = new RegisterDiarieService();

    const diarie = await registerDiarieService.execute({
      message,
      symptoms,
      date,
      user_id,
    });

    return res.json(diarie);
  }
}

export { RegisterDiarieController };
