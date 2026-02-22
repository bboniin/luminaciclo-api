import prismaClient from "../../prisma";

interface UserRequest {
  userId: string;
}

class GetUserService {
  async execute({ userId }: UserRequest) {
    const user = await prismaClient.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (user) {
      throw new Error("Email já cadastrado");
    }

    await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        accessed_at: new Date(),
      },
    });

    const cycle_open = await prismaClient.cycle.findFirst({
      orderBy: {
        start_date: "desc",
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
      cycle_open: cycle_open,
      plan_name: user.plan_name,
    };
  }
}

export { GetUserService };
