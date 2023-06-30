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
  "/",
  // ensureAuthenticated,
  multer(multerConfigProduct).single("image"),
  (req: Request, res: Response) => {
    productsController.createProduct(req, res);
  }
);

routesProduct.get("/", (req: Request, res: Response) => {
  productsController.listProducts(req, res);
});

routesProduct.get("/:id", (req: Request, res: Response) => {
  productsController.listProductById(req, res);
});

routesProduct.delete(
  "/:id",
  ensureAuthenticated,
  (req: Request, res: Response) => {
    productsController.deleteProduct(req, res);
  }
);

routesProduct.put(
  "/:id",
  ensureAuthenticated,
  (req: Request, res: Response) => {
    productsController.updateProduct(req, res);
  }
);

export default routesProduct;
