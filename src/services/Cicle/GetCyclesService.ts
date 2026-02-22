import { sign } from "jsonwebtoken";
import prismaClient from "../../prisma";

interface CycleRequest {
  user_id: string;
}

class GetCyclesService {
  async execute({ user_id }: CycleRequest) {
    const cycles = await prismaClient.cycle.findMany({
      where: {
        user_id,
      },
      orderBy: {
        start_date: "desc",
      },
    });

    return cycles;
  }
}

export { GetCyclesService };
