import { Router } from "express";
import { ProjectController } from "../../../controllers/project";

const TabularClassification = Router();

TabularClassification.post(
  "/train",
  ProjectController.trainTabularClassificationProject
);
TabularClassification.post("/predict", ProjectController.predictProject);

export default TabularClassification;
