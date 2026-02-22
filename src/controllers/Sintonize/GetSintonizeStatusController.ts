import { Request, Response } from 'express';
import { GetSintonizeStatusService } from '../../services/Sintonize/GetSintonizeStatusService';

class GetSintonizeStatusController {
    async handle(req: Request, res: Response) {
        const user_id = req.userId;
        
        const getSintonizeStatusService = new GetSintonizeStatusService();

        const sintonizeStatus = await getSintonizeStatusService.execute({
            user_id
        });

        return res.json(sintonizeStatus);
    }
}

export { GetSintonizeStatusController };