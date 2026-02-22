import prismaClient from "../../prisma";
import { sign } from "jsonwebtoken";
import auth from "../../utils/auth";
import { compare } from "bcryptjs";

interface AuthRequest {
  email: string;
  password: string;
}

class AuthAdminService {
  async execute({ email, password }: AuthRequest) {
    if (!password || !email) {
      throw new Error("Email e Senha são obrigatórios");
    }

    const admin = await prismaClient.admin.findFirst({
      where: {
        email: email,
      },
    });

    if (!admin) {
      throw new Error("Email e Senha não correspondem ou não existe");
    }
    /*
    const passwordMatch = await compare(password, admin.password);

    if (!passwordMatch) {
      throw new Error("Email e Senha não correspondem ou não existe");
    }*/

    const token = sign(
      {
        email: admin.email,
        type: "admin",
      },
      auth.jwt.secret,
      {
        subject: admin.id,
        expiresIn: "365d",
      },
    );

    return {
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        photo: admin.photo,
      },
      token: token,
    };
  }
}

export { AuthAdminService };
