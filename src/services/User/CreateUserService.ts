import { hash } from "bcryptjs";
import prismaClient from "../../prisma";
import { sign } from "jsonwebtoken";
import auth from "../../utils/auth";

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, password, email }: UserRequest) {
    if (!name || !password || !email) {
      throw new Error("Nome, email e senha são obrigatórios");
    }

    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userAlreadyExists) {
      throw new Error("Email já cadastrado");
    }

    const passwordHash = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: {
        active: true,
        name: name,
        plan_name: "FREE",
        password: passwordHash,
        email: email,
        phase: "LUTEA",
        plan_active: false,
      },
    });

    const token = sign(
      {
        email: user.email,
        type: "user",
      },
      auth.jwt.secret,
      {
        subject: user.id,
        expiresIn: "365d",
      },
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        birthday: user.birthday,
        phone_number: user.phone_number,
        phase: user.phase,
        days_cycle: user.days_cycle,
        days_menstruation: user.days_menstruation,
        plan_name: user.plan_name,
      },
      token: token,
    };
  }
}

export { CreateUserService };
