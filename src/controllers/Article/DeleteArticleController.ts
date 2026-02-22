import { Request, Response } from "express";
import { DeleteArticleService } from "../../services/Article/DeleteArticleService";

class DeleteArticleController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const userId = req.userId;

    const deleteArticleService = new DeleteArticleService();

    const article = await deleteArticleService.execute({
      id,
      userId,
    });

    return res.json(article);
  }
}

export { DeleteArticleController };
