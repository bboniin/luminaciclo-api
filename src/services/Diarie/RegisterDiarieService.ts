import { endOfDay, startOfDay } from "date-fns";
import prismaClient from "../../prisma";

interface DiarieRequest {
  message: string;
  symptoms: string;
  date: Date;
  user_id: string;
}

class RegisterDiarieService {
  async execute({ message, date, symptoms, user_id }: DiarieRequest) {
    if (!user_id) {
      throw new Error("Usuário não encontrado");
    }

    const dateSelected = date ? new Date(date) : new Date();

    const diarieGet = await prismaClient.diarie.findFirst({
      where: {
        user_id,
        created_at: {
          gte: startOfDay(dateSelected),
          lte: endOfDay(dateSelected),
        },
      },
    });

    if (diarieGet) {
      const diarie = await prismaClient.diarie.update({
        where: {
          id: diarieGet.id,
        },
        data: {
          message: message || diarieGet.message,
          symptoms: symptoms || diarieGet.symptoms,
        },
      });
      return diarie;
    } else {
      const diarie = await prismaClient.diarie.create({
        data: {
          message,
          symptoms,
          created_at: dateSelected,
          user_id,
        },
      });
      return diarie;
    }
  }
}

export { RegisterDiarieService };
