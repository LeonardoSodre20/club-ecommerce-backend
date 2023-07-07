import multerConfig from "@config/multer.config";
import { Router, Request, Response } from "express";

// ROUTES
import categoriesController from "./categories.controller";
import multer from "multer";

const routesCategories = Router();

routesCategories.post(
  "/",
  multer(multerConfig).single("image"),
  (req: Request, res: Response) => {
    categoriesController.store(req, res);
  }
);

routesCategories.get("/", (req: Request, res: Response) => {
  categoriesController.listAll(req, res);
});

routesCategories.get("/:id", (req: Request, res: Response) => {
  categoriesController.listById(req, res);
});

routesCategories.get("/name/:name", (req: Request, res: Response) => {
  categoriesController.listByName(req, res);
});

routesCategories.delete("/:id", (req: Request, res: Response) => {
  categoriesController.deleteById(req, res);
});

export default routesCategories;
