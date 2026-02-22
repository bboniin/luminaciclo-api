import prismaClient from '../../prisma'
import { startOfDay, endOfDay } from 'date-fns';

interface SintonizeRequest {
    user_id: string;
}

class GetSintonizeStatusService {
    async execute({ user_id }: SintonizeRequest) {
        if (!user_id) {
            throw new Error("User not found");
        }

        const today = new Date();

        const diarie = await prismaClient.diarie.findFirst({
            where: {
                user_id,
                created_at: {
                    gte: startOfDay(today),
                    lte: endOfDay(today)
                }
            }
        });

        // TODO: Implement the logic to check if the user has viewed all the content for the day.
        // This will probably require a new model to associate content with a specific day for each user.
        const viewedAllContent = true; // Hardcoded for now.

        return {
            diarie_filled: !!diarie,
            viewed_all_content: viewedAllContent,
            sintonize_completed: !!diarie && viewedAllContent
        };
    }
}

export { GetSintonizeStatusService };