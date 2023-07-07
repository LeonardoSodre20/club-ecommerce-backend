import { Router, Response, Request } from "express";
import multer from "multer";
import multerConfigUser from "./users.multer";

const routesUser = Router();

// CONTROLLER
import usersController from "./users.controller";

routesUser.post("/users", (req: Request, res: Response) => {
  usersController.store(req, res);
});

routesUser.get("/users", (req: Request, res: Response) => {
  usersController.listAndCountAll(req, res);
});

routesUser.put(
  "/users/:id",
  multer(multerConfigUser).single("avatar"),
  (req: Request, res: Response) => {
    usersController.updateById(req, res);
  }
);

routesUser.delete("/users/:id", (req: Request, res: Response) => {
  usersController.deleteUsers(req, res);
});

export default routesUser;
