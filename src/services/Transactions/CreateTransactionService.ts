import prismaClient from "../../prisma";

interface TransactionRequest {
  purchase_id: string;
  token_id: string;
  store: "google" | "apple";
  plan_name: string;
  value: number;
  user_id: string;
}

class CreateTransactionService {
  async execute({
    purchase_id,
    token_id,
    store,
    plan_name,
    value,
    user_id,
  }: TransactionRequest) {
    if (!user_id) {
      throw new Error("User not found");
    }

    // TODO: Implement purchase validation with Google/Apple stores.
    // This will require using a library like 'in-app-purchase' or similar.
    const isPurchaseValid = true; // Hardcoded for now.

    if (!isPurchaseValid) {
      throw new Error("Invalid purchase token");
    }

    const transaction = await prismaClient.purchase.create({
      data: {
        purchase_id,
        token_id,
        store,
        plan_name,
        value,
        user_id,
        status: "completed",
      },
    });

    // Update user's plan
    await prismaClient.user.update({
      where: {
        id: user_id,
      },
      data: {
        plan_name: "PREMIUM_MENSAL",
        plan_active: true,
        // TODO: set expire_plan based on the plan duration
        expire_plan: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1),
        ),
      },
    });

    return transaction;
  }
}

export { CreateTransactionService };
