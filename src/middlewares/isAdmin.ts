import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken'
import authConfig from "../utils/auth"
import prismaClient from '../prisma';

interface Payload {
  sub: string;
  type: string;
}

export async function isAdmin(req: Request, res: Response, next: NextFunction) {

  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const [, token] = authToken.split(' ');

  try {

    const { sub, type } = verify(
      token,
      authConfig.jwt.secret,
    ) as Payload

    req.userId = sub;

    if (type == "user") {
      return res.status(401).json({ message: 'Rota apenas para administrador' });
    }

    const user = await prismaClient.admin.findUnique({
      where: {
          id: req.userId
      }
    })
    
    if (!user) {
      return res.status(401).json({ message: 'Rota apenas para administrador' });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Internal server Error' });
  }

}
