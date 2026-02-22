import { Request, Response } from "express";
import { CreateContentArticleService } from "../../services/Article/CreateContentArticleService";

class CreateContentArticleController {
  async handle(req: Request, res: Response) {
    const { type, order, article_id } = req.body;

    const userId = req.userId;

    let file = "";
    if (req.file) {
      file = req.file.filename;
    }

    const createContentArticleService = new CreateContentArticleService();

    const article = await createContentArticleService.execute({
      type,
      order: parseInt(order),
      file,
      userId,
      article_id,
    });

    return res.json(article);
  }
}

export { CreateContentArticleController };
