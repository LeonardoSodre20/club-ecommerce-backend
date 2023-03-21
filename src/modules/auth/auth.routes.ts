import { Response, Request, Router } from "express";
import authController from "./auth.controller";

const routesAuth = Router();

routesAuth.post("/login", (req: Request, res: Response) => {
  authController.login(req, res);
});

routesAuth.post("/forgot", (req: Request, res: Response) => {
  authController.forgotPassword(req, res);
});

routesAuth.post("/reset", (req: Request, res: Response) => {
  authController.resetPassword(req, res);
});

export default routesAuth;
