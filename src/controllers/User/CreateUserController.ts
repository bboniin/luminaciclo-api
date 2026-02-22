import { Request, Response } from "express";
import { CreateUserService } from "../../services/User/CreateUserService";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name,
      email,
      password,
    });

    if (user["photo"]) {
      user["photo_url"] =
        "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" + user["photo"];
    }

    return res.json(user);
  }
}

export { CreateUserController };
