import {Router} from "express";
import {ProjectController} from "../../../controllers/project";
import ImageClassification from "./ImageClassification";

const projectRouter = Router();

projectRouter.post("/createProject", ProjectController.createProject);

projectRouter.post("/getAllProject", ProjectController.getAllProject);

projectRouter.get("/:projectId", ProjectController.getProjectById);

projectRouter.use("/ImageClassification", ImageClassification);

export default projectRouter;
