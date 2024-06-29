import { Router } from "express";
import { ProjectController } from "../../../controllers/project";

const ImageClassification = Router();

/**
 * @openapi
 * /api/v1/ImageClassification/train:
 *   post:
 *    tags:
 *    - projects
 *    description:
 *   requestBody:
 *    required: true
 *
 *
 */
ImageClassification.post(
  "/train",
  ProjectController.trainImageClassificationProject
);
ImageClassification.post("/predict", ProjectController.predictProject);

export default ImageClassification;
