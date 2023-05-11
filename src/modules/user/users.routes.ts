import { Router, Response, Request } from "express";
import multer from "multer";
import multerConfig from "@config/multer.config";

const routesUser = Router();

// CONTROLLER
import usersController from "./users.controller";

routesUser.post("/", (req: Request, res: Response) => {
  usersController.createUser(req, res);
});

routesUser.get("/", (req: Request, res: Response) => {
  usersController.listAndCountAllUsers(req, res);
});

routesUser.put("/:id", (req: Request, res: Response) => {
  usersController.updateUsers(req, res);
});

routesUser.delete("/:id", (req: Request, res: Response) => {
  usersController.deleteUsers(req, res);
});

routesUser.patch(
  "/avatar/:id",
  multer(multerConfig).single("avatar"),
  (req: Request, res: Response) => {
    usersController.updateAvatar(req, res);
  }
);

export default routesUser;
