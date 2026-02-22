import { Request, Response } from 'express';
import { ListUsersService } from '../../services/Admin/ListUsersService';

class ListUsersController {
    async handle(req: Request, res: Response) {
        const { page = 0, all = false } = req.query;

        const listUsersService = new ListUsersService();

        const users = await listUsersService.execute({ 
            page: Number(page), 
            all: all === 'true' 
        });

        return res.json(users);
    }
}

export { ListUsersController };