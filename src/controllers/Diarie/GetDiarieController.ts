import { Request, Response } from 'express';
import { GetDiarieService } from '../../services/Diarie/GetDiarieService';

class GetDiarieController {
    async handle(req: Request, res: Response) {
        const user_id = req.userId;
        const { date } = req.query;

        const getDiarieService = new GetDiarieService();

        const diarie = await getDiarieService.execute({
            user_id,
            date: date ? String(date) : undefined
        });

        return res.json(diarie);
    }
}

export { GetDiarieController };