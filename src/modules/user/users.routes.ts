import { Router, Response, Request } from "express";

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

export default routesUser;
