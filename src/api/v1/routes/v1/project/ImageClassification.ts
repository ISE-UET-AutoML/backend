import { Router } from "express";
import { ProjectController } from "../../../controllers/project";

const ImageClassification = Router();

ImageClassification.post(
  "/train",
  ProjectController.trainImageClassificationProject
);
ImageClassification.post("/predict", ProjectController.predictProject);

export default ImageClassification;
