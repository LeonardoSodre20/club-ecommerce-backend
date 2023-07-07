import { Response, Request, Router, NextFunction } from "express";
import authController from "./auth.controller";

const routesAuth = Router();

routesAuth.post("/auth/login", (req: Request, res: Response) => {
  authController.login(req, res);
});

routesAuth.post("/auth/forgot", (req: Request, res: Response) => {
  authController.forgotPassword(req, res);
});

routesAuth.post("/auth/token", (req: Request, res: Response) => {
  authController.validateToken(req, res);
});

routesAuth.post("/auth/reset", (req: Request, res: Response) => {
  authController.resetPassword(req, res);
});

export default routesAuth;
