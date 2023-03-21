import { Response, Request, Router } from "express";
import authController from "./auth.controller";

const routesAuth = Router();

routesAuth.post("/login", (req: Request, res: Response) => {
  authController.login(req, res);
});

export default routesAuth;
