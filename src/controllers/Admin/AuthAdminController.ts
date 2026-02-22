import { Request, Response } from "express";
import { AuthAdminService } from "../../services/Admin/AuthAdminService";

class AuthAdminController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const authAdminService = new AuthAdminService();

    const admin = await authAdminService.execute({
      email,
      password,
    });

    if (admin["photo"]) {
      admin["photo_url"] =
        "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" + admin["photo"];
    }

    return res.json(admin);
  }
}

export { AuthAdminController };
