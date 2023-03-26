import { Router, Request, Response } from "express";

// ROUTES
import categoriesController from "./categories.controller";

const routesCategories = Router();

routesCategories.post("/", (req: Request, res: Response) => {
  categoriesController.createCategory(req, res);
});

routesCategories.get("/", (req: Request, res: Response) => {
  categoriesController.listAllCategories(req, res);
});

routesCategories.get("/:id", (req: Request, res: Response) => {
  categoriesController.listCategoryByID(req, res);
});

routesCategories.get("/name/:name", (req: Request, res: Response) => {
  categoriesController.listCategoryByName(req, res);
});

routesCategories.delete("/:id", (req: Request, res: Response) => {
  categoriesController.deleteCategoryByID(req, res);
});

export default routesCategories;
