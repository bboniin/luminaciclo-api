import { Request, Response } from "express";
import { CreateArticleService } from "../../services/Article/CreateArticleService";

class CreateArticleController {
  async handle(req: Request, res: Response) {
    const { title, title_photo, session, language, contents } = req.body;

    let photo = "";

    const userId = req.userId;

    if (req.file) {
      photo = req.file.filename;
    }

    const createArticleService = new CreateArticleService();

    const article = await createArticleService.execute({
      title,
      photo,
      language,
      title_photo,
      session,
      contents: JSON.parse(contents) || [],
      userId,
    });

    return res.json(article);
  }
}

export { CreateArticleController };
