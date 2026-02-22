import prismaClient from "../../prisma";

interface TransactionsRequest {
  page: number;
  all: boolean;
}

class ListTransactionsService {
  async execute({ page, all }: TransactionsRequest) {
    const filter = {};

    const transactionsTotal = await prismaClient.purchase.count(filter);

    if (!all) {
      filter["skip"] = page * 30;
      filter["take"] = 30;
    }

    const transactions = await prismaClient.purchase.findMany({
      ...filter,
      orderBy: {
        create_at: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { transactions, transactionsTotal };
  }
}

export { ListTransactionsService };
