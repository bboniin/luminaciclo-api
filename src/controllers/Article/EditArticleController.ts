import { Request, Response } from "express";
import { EditArticleService } from "../../services/Article/EditArticleService";

class EditArticleController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const {
      title,
      title_photo,
      session,
      photo,
      language,
      active,
      contents,
      contentsDelete,
    } = req.body;

    const userId = req.userId;

    const editArticleService = new EditArticleService();

    const article = await editArticleService.execute({
      id,
      title,
      title_photo,
      session,
      photo,
      language,
      active,
      userId,
      contents: JSON.parse(contents) || [],
      contentsDelete: JSON.parse(contentsDelete) || [],
    });

    return res.json(article);
  }
}

export { EditArticleController };
