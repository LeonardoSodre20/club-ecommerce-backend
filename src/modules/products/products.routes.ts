import { Router, Response, Request } from "express";

// CONTROLLER
import productsController from "./products.controller";
import { ensureAuthenticated } from "@middlewares/Authorization";

const routesProduct = Router();

// ROTAS

routesProduct.post("/", ensureAuthenticated, (req: Request, res: Response) => {
  productsController.createProduct(req, res);
});

routesProduct.get("/", ensureAuthenticated, (req: Request, res: Response) => {
  productsController.listProducts(req, res);
});

routesProduct.get(
  "/:id",
  ensureAuthenticated,
  (req: Request, res: Response) => {
    productsController.listProductById(req, res);
  }
);

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
