import { Router } from "express";
import { RunController } from "../../../controllers/run";

const runRouter = Router();

runRouter.post("/getAllRun", RunController.getAllRun);

export default runRouter;