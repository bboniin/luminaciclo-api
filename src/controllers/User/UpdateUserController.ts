import { Request, Response } from "express";
import { UpdateUserService } from "../../services/User/UpdateUserService";

class UpdateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, phone_number, birthday } = req.body;

    let photo = "";

    if (req.file) {
      photo = req.file.filename;
    }

    const userId = req.userId;

    const updateUserService = new UpdateUserService();

    const user = await updateUserService.execute({
      name,
      email,
      phone_number,
      birthday,
      photo,
      userId,
    });

    if (user["photo"]) {
      user["photo_url"] =
        "https://luminaciclo-data.s3.sa-east-1.amazonaws.com/" + user["photo"];
    }

    return res.json(user);
  }
}

export { UpdateUserController };
