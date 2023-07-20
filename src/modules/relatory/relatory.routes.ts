import { Router, Response, Request } from "express";

const routesRelatory = Router();

import relatoryController from "./relatory.controller";

routesRelatory.get("/relatory/", (req: Request, res: Response) => {
  relatoryController.getRelatoryInformations(req, res);
});

routesRelatory.get("/amountByCategory", (req: Request, res: Response) => {
  relatoryController.findAndAddByCategory(req, res);
});

export default routesRelatory;
