import prismaClient from "../../prisma";
import { sign } from "jsonwebtoken";
import auth from "../../utils/auth";
import { compare } from "bcryptjs";

interface AuthRequest {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthRequest) {
    if (!password || !email) {
      throw new Error("Email e Senha são obrigatórios");
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("Email e Senha não correspondem ou não existe");
    }

    /* const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email e Senha não correspondem ou não existe");
    }
*/
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

    const total_cycles = await prismaClient.cycle.count({
      where: {
        user_id: user.id,
      },
    });

    return {
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
      start_cycle: user.start_cycle,
      total_cycles: total_cycles,
      token: token,
    };
  }
}

export { AuthUserService };
