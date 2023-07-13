import { Router, Response, Request } from "express";

// UPLOAD
import multer from "multer";
import multerConfigProduct from "./products.multer";

// CONTROLLER
import productsController from "./products.controller";

// MIDDLEWARES
import { ensureAuthenticated } from "@middlewares/Authorization";

const routesProduct = Router();

// ROUTES

routesProduct.post(
  "/product",
  // ensureAuthenticated,
  multer(multerConfigProduct).single("image"),
  (req: Request, res: Response) => {
    productsController.store(req, res);
  }
);

routesProduct.get("/product", (req: Request, res: Response) => {
  productsController.listAndCount(req, res);
});

routesProduct.get("/product/:id", (req: Request, res: Response) => {
  productsController.listProductById(req, res);
});

routesProduct.delete(
  "/product/:id",
  ensureAuthenticated,
  (req: Request, res: Response) => {
    productsController.deleteProduct(req, res);
  }
);

routesProduct.put(
  "/product/:id",
  ensureAuthenticated,
  (req: Request, res: Response) => {
    productsController.updateProduct(req, res);
  }
);

export default routesProduct;
