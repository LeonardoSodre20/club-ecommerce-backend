import multerConfig from "@config/multer.config";
import { Router, Request, Response } from "express";

import categoriesController from "./categories.controller";
import multer from "multer";

const routesCategories = Router();

routesCategories.post(
  "/category",
  multer(multerConfig).single("image"),
  (req: Request, res: Response) => {
    categoriesController.store(req, res);
  }
);

routesCategories.get("/category", (req: Request, res: Response) => {
  categoriesController.listAll(req, res);
});

routesCategories.get("/category/:id", (req: Request, res: Response) => {
  categoriesController.listById(req, res);
});

routesCategories.get("/category/name/:name", (req: Request, res: Response) => {
  categoriesController.listByName(req, res);
});

routesCategories.delete("/category/:id", (req: Request, res: Response) => {
  categoriesController.deleteById(req, res);
});

export default routesCategories;
