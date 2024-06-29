import { Router } from "express";
import { ProjectController } from "../../../controllers/project";
import ImageClassification from "./ImageClassification";
import TabularClassification from "./TabularClassification";

const projectRouter = Router();

/**
 * @openapi
 * /projects/createProject:
 *   post:
 *    tags:
 *    - projects
 *    description: Create a new project
 *   requestBody:
 *    required: true
 *
 *
 */
projectRouter.post("/createProject", ProjectController.createProject);

projectRouter.post("/getAllProject", ProjectController.getAllProject);

projectRouter.get("/:projectId", ProjectController.getProjectById);

projectRouter.use("/ImageClassificatioyn", ImageClassification);

projectRouter.use("/TabularClassification", TabularClassification);

export default projectRouter;
