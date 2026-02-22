import { Request, Response } from 'express';
import { CreateTransactionService } from '../../services/Transactions/CreateTransactionService';

class CreateTransactionController {
    async handle(req: Request, res: Response) {
        const { purchase_id, token_id, store, plan_name, value } = req.body;
        const user_id = req.userId;
        
        const createTransactionService = new CreateTransactionService();

        const transaction = await createTransactionService.execute({
            purchase_id,
            token_id,
            store,
            plan_name,
            value,
            user_id
        });

        return res.json(transaction);
    }
}

export { CreateTransactionController };