import prismaClient from "../../prisma";
import { startOfDay, endOfDay } from "date-fns";

interface DiarieRequest {
  user_id: string;
  date?: string;
}

class GetDiarieService {
  async execute({ user_id, date }: DiarieRequest) {
    if (!user_id) {
      throw new Error("Usuário não encontrado");
    }

    const searchDate = date ? new Date(date) : new Date();

    const diarie = await prismaClient.diarie.findFirst({
      where: {
        user_id,
        created_at: {
          gte: startOfDay(searchDate),
          lte: endOfDay(searchDate),
        },
      },
    });

    return diarie;
  }
}

export { GetDiarieService };
