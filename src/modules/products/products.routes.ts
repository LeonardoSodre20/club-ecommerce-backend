import { Router, Response, Request } from "express";

// CONTROLLER
import productsController from "./products.controller";

// MIDDLEWARES
import { ensureAutheticated } from "@middlewares/Authorization";

const routesProduct = Router();

routesProduct.post("/", ensureAutheticated, (req: Request, res: Response) => {
  productsController.createProduct(req, res);
});

routesProduct.get("/", ensureAutheticated, (req: Request, res: Response) => {
  productsController.listProducts(req, res);
});

routesProduct.get("/:id", (req: Request, res: Response) => {
  productsController.listProductById(req, res);
});

routesProduct.delete("/:id", (req: Request, res: Response) => {
  productsController.deleteProduct(req, res);
});

routesProduct.put("/:id", (req: Request, res: Response) => {
  productsController.updateProduct(req, res);
});

export default routesProduct;
