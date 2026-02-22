import { Request, Response } from "express";
import { EditContentArticleService } from "../../services/Article/EditContentArticleService";

class EditContentArticleController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { order } = req.body;

    let file = "";
    if (req.file) {
      file = req.file.filename;
    }

    const userId = req.userId;

    const editContentArticleService = new EditContentArticleService();

    const article = await editContentArticleService.execute({
      id,
      order: parseInt(order),
      file,
      userId,
    });

    return res.json(article);
  }
}

export { EditContentArticleController };
