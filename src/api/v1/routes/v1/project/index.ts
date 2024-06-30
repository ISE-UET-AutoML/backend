import { Router } from "express";
import { ProjectController } from "../../../controllers/project";
import ImageClassification from "./ImageClassification";
import TabularClassification from "./TabularClassification";
import { Post } from "tsoa";

const projectRouter = Router();

/**
 * @openapi
 * /api/v1/projects/createProject:
 *   post:
 *     tags:
 *       - authentication
 *     description:
 *   requestBody:
 *     required: true
 *   parameters:
 *     - name: email
 *       in: formData
 *       required: true
 *       type: string
 *     - name: password
 *       in: formData
 *       required: true
 *       type: string
 */
projectRouter.post("/createProject", ProjectController.createProject);

projectRouter.post("/getAllProject", ProjectController.getAllProject);

projectRouter.get("/:projectId", ProjectController.getProjectById);

projectRouter.use("/ImageClassificatioyn", ImageClassification);

projectRouter.use("/TabularClassification", TabularClassification);

export default projectRouter;
