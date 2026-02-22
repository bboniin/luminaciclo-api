import { Router } from "express";
import multer from "multer";

import uploadConfig from "./config/multer";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { isAdmin } from "./middlewares/isAdmin";

// User
import { CreateUserController } from "./controllers/User/CreateUserController";
import { AuthUserController } from "./controllers/User/AuthUserController";

// Admin
import { ListUsersController } from "./controllers/Admin/ListUsersController";
import { AuthAdminController } from "./controllers/Admin/AuthAdminController";

// Diarie
import { RegisterDiarieController } from "./controllers/Diarie/RegisterDiarieController";
import { GetDiarieController } from "./controllers/Diarie/GetDiarieController";

// Insight
import { GetInsightController } from "./controllers/Insight/GetInsightController";
import { CreateInsightController } from "./controllers/Insight/CreateInsightController";
import { ListInsightsController } from "./controllers/Insight/ListInsightsController";
import { EditInsightController } from "./controllers/Insight/EditInsightController";
import { DeleteInsightController } from "./controllers/Insight/DeleteInsightController";

// Article
import { ListUserArticlesController } from "./controllers/Article/ListUserArticlesController";
import { GetArticleController } from "./controllers/Article/GetArticleController";
import { CreateContentArticleController } from "./controllers/Article/CreateContentArticleController";
import { EditContentArticleController } from "./controllers/Article/EditContentArticleController";
import { DeleteArticleController } from "./controllers/Article/DeleteArticleController";
import { ListArticlesController } from "./controllers/Article/ListArticlesController";
import { CreateArticleController } from "./controllers/Article/CreateArticleController";
import { EditArticleController } from "./controllers/Article/EditArticleController";

// Nutrition
import { ListUserNutritionsController } from "./controllers/Nutrition/ListUserNutritionsController";
import { GetNutritionController } from "./controllers/Nutrition/GetNutritionController";
import { ListNutritionsController } from "./controllers/Nutrition/ListNutritionsController";
import { CreateNutritionController } from "./controllers/Nutrition/CreateNutritionController";
import { EditNutritionController } from "./controllers/Nutrition/EditNutritionController";
import { CreateContentNutritionController } from "./controllers/Nutrition/CreateContentNutritionController";
import { EditContentNutritionController } from "./controllers/Nutrition/EditContentNutritionController";
import { DeleteNutritionController } from "./controllers/Nutrition/DeleteNutritionController";

// Exercise
import { ListUserExercisesController } from "./controllers/Exercise/ListUserExercisesController";
import { GetExerciseController } from "./controllers/Exercise/GetExerciseController";
import { ListExercisesController } from "./controllers/Exercise/ListExercisesController";
import { CreateExerciseController } from "./controllers/Exercise/CreateExerciseController";
import { EditExerciseController } from "./controllers/Exercise/EditExerciseController";
import { CreateContentExerciseController } from "./controllers/Exercise/CreateContentExerciseController";
import { EditContentExerciseController } from "./controllers/Exercise/EditContentExerciseController";
import { DeleteExerciseController } from "./controllers/Exercise/DeleteExerciseController";

// Sintonize
import { GetSintonizeStatusController } from "./controllers/Sintonize/GetSintonizeStatusController";

// Transaction
import { CreateTransactionController } from "./controllers/Transactions/CreateTransactionController";

// Cicle
import { GetCyclesController } from "./controllers/Cicle/GetCyclesController";
import { UpdateCicleController } from "./controllers/Cicle/UpdateCicleController";
import { ListUserInsightsController } from "./controllers/Insight/ListUserInsightsController";
import { GetUserArticleController } from "./controllers/Article/GetUserArticleController";
import { GetUserNutritionController } from "./controllers/Nutrition/GetUserNutritionController";
import { GetUserExerciseController } from "./controllers/Exercise/GetUserExerciseController";
import { GetUserInsightController } from "./controllers/Insight/GetUserInsightController";
import { GetDashController } from "./controllers/Admin/GetDashController";
import { GetUserController } from "./controllers/User/GetUserController";
import { UpdateUserController } from "./controllers/User/UpdateUserController";
import { CompletedRegisterUserController } from "./controllers/User/CompletedRegisterUserController";
import { GetMenstruationController } from "./controllers/Cicle/GetMenstruationController";
import { RegisterMenstruationController } from "./controllers/Cicle/RegisterMenstruationController";

const upload = multer(uploadConfig);
const router = Router();

//Public Routes
router.post("/users", new CreateUserController().handle);
router.post("/session", new AuthUserController().handle);
router.post("/admin/session", new AuthAdminController().handle);

//User Routes
router.use(isAuthenticated);

// Diarie
router.get("/users", new GetUserController().handle);
router.put("/users", new UpdateUserController().handle);
router.put("/users/completed", new CompletedRegisterUserController().handle);
router.post("/diaries", new RegisterDiarieController().handle);
router.get("/diaries", new GetDiarieController().handle);

// Insight
router.get("/insights", new ListUserInsightsController().handle);
router.get("/insights/:id", new GetUserInsightController().handle);

// Article
router.get("/articles", new ListUserArticlesController().handle);
router.get("/articles/:id", new GetUserArticleController().handle);

// Nutrition
router.get("/nutritions", new ListUserNutritionsController().handle);
router.get("/nutritions/:id", new GetUserNutritionController().handle);

// Exercise
router.get("/exercises", new ListUserExercisesController().handle);
router.get("/exercises/:id", new GetUserExerciseController().handle);

// Sintonize
router.get("/sintonize", new GetSintonizeStatusController().handle);

// Transaction
router.post("/transactions", new CreateTransactionController().handle);

// Cicle
router.get("/cycles", new GetCyclesController().handle);
router.put("/cicle", new UpdateCicleController().handle);
router.get("/menstruation", new GetMenstruationController().handle);
router.post("/menstruation", new RegisterMenstruationController().handle);

//Admin Routes
router.use(isAdmin);

// User
router.get("/admin/users", new ListUsersController().handle);
router.get("/admin/dash", new GetDashController().handle);

// Insight
router.get("/admin/insight/:id", new GetInsightController().handle);
router.get("/admin/insights", new ListInsightsController().handle);
router.post(
  "/admin/insight",
  upload.single("file"),
  new CreateInsightController().handle,
);
router.put(
  "/admin/insight/:id",
  upload.single("file"),
  new EditInsightController().handle,
);
router.delete("/admin/insight/:id", new DeleteInsightController().handle);

// Article
router.get("/admin/article/:id", new GetArticleController().handle);
router.get("/admin/articles", new ListArticlesController().handle);
router.post(
  "/admin/article",
  upload.single("file"),
  new CreateArticleController().handle,
);
router.put(
  "/admin/article/:id",
  upload.single("file"),
  new EditArticleController().handle,
);
router.post(
  "/admin/content-article",
  upload.single("file"),
  new CreateContentArticleController().handle,
);
router.put(
  "/admin/content-article/:id",
  upload.single("file"),
  new EditContentArticleController().handle,
);
router.delete("/admin/article/:id", new DeleteArticleController().handle);

// Nutrition
router.get("/admin/nutrition/:id", new GetNutritionController().handle);
router.get("/admin/nutritions", new ListNutritionsController().handle);
router.post(
  "/admin/nutrition",
  upload.single("file"),
  new CreateNutritionController().handle,
);
router.put(
  "/admin/nutrition/:id",
  upload.single("file"),
  new EditNutritionController().handle,
);
router.post(
  "/admin/content-nutrition",
  upload.single("file"),
  new CreateContentNutritionController().handle,
);
router.put(
  "/admin/content-nutrition/:id",
  upload.single("file"),
  new EditContentNutritionController().handle,
);
router.delete("/admin/nutrition/:id", new DeleteNutritionController().handle);

// Exercise
router.get("/admin/exercise/:id", new GetExerciseController().handle);
router.get("/admin/exercises", new ListExercisesController().handle);
router.post(
  "/admin/exercise",
  upload.single("file"),
  new CreateExerciseController().handle,
);
router.put(
  "/admin/exercise/:id",
  upload.single("file"),
  new EditExerciseController().handle,
);
router.post(
  "/admin/content-exercise",
  upload.single("file"),
  new CreateContentExerciseController().handle,
);

router.put(
  "/admin/content-exercise/:id",
  upload.single("file"),
  new EditContentExerciseController().handle,
);
router.delete("/admin/exercise/:id", new DeleteExerciseController().handle);

export { router };
