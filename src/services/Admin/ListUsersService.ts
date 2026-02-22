import prismaClient from "../../prisma";

interface UsersRequest {
  page: number;
  all: boolean;
}

class ListUsersService {
  async execute({ page, all }: UsersRequest) {
    let filter = {};

    const usersTotal = await prismaClient.user.count(filter);

    if (all) {
      const users = await prismaClient.user.findMany({
        ...filter,
        orderBy: {
          created_at: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          plan_name: true,
          plan_active: true,
          phone_number: true,
          phase: true,
          active: true,
          birthday: true,
        },
      });
      return users;
    }

    const users = await prismaClient.user.findMany({
      ...filter,
      orderBy: {
        created_at: "desc",
      },
      skip: page * 30,
      take: 30,
      select: {
        id: true,
        name: true,
        email: true,
        plan_name: true,
        plan_active: true,
        phone_number: true,
        phase: true,
        active: true,
        birthday: true,
        created_at: true,
        accessed_at: true,
      },
    });

    return { users, usersTotal };
  }
}

export { ListUsersService };
