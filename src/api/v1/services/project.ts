import { Project, Run, Task, User } from "../models";
import { db } from "../db";
import config from "../../../config";
import axios from "axios";
import httpStatusCodes from "../errors/httpStatusCodes";

export type ProjectRequest = {
  email: string;
  name: string;
  task: string;
  description: string;
};

export type ProjectTrainRequest = {
  training_time: string;
  userEmail: string;
  projectId: string;
};

// This is only for image classification.
// TODO: Add support prediction for other tasks.
export type ProjectPredictRequest = {
  userEmail: string;
  projectId: string;
  image: File;
};

const convertStringTask = (task: string): Task => {
  switch (task) {
    case "Image Classification":
      return Task.IMAGE_CLASSIFICATION;
    case "Object Detection":
      return Task.OBJECT_DETECTION;
    case "Tabular Data Classification (Multi-class)":
      return Task.TABULAR_CLASSIFICATION;
    case "Text Classification":
      return Task.TEXT_CLASSIFICATION;
    case "Text Generation":
      return Task.TEXT_GENERATION;
    case "Question Answering":
      return Task.QUESTION_ANSWERING;
    case "Summarization":
      return Task.SUMMARIZATION;
    case "Tabular Data Regression":
      return Task.TABULAR_DATA_REGRESSION;
    case "LLM Finetuning":
      return Task.LLM_FINETUNING;
    default:
      throw new Error(`Invalid task string: ${task}`);
  }
};

const createProject = async (req: ProjectRequest): Promise<Project | null> => {
  let { email, name, task, description } = req;
  try {
    console.log("email when create project: " + email);
    const user = await db.getRepository(User).findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      console.error("User not found");
      return null;
    }
    const project = new Project();
    project.name = name;
    project.description = description;
    project.task = convertStringTask(task);
    project.user = user;

    await db.getRepository(Project).save(project);

    return project;
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

const getAllProject = async (email: string): Promise<Project[] | null> => {
  try {
    const user = await db.getRepository(User).findOne({
      where: {
        email: email,
      },
    });
    console.log(user);
    if (!user) {
      console.error("User not found");
      return null;
    }
    const projects = await db
      .getRepository(Project)
      .createQueryBuilder("project")
      .orderBy("project.updated_at", "DESC")
      .where("project.user.id = :userId", { userId: user.id })
      .getMany();

    console.log(projects);
    return projects;
  } catch (error: any) {
    console.error("Error to get all data from project table");
    throw error;
  }
};

const TrainImageClassifierProject = async (req: ProjectTrainRequest) => {
  try {
    const project = await GetProjectFromId(req.projectId);
    console.log("project req id:", req.projectId);
    if (!project) {
      console.error("Project not found");
      return null;
    }
    console.log("project id:", project.id);
    const run = new Run();
    await db.getRepository(Run).save(run);
    run.name = `Model-v${run.id}`;
    run.project = project;
    console.log(run.project);
    await db.getRepository(Run).save(run);

    // convert email to -> without @ <=> bucket name
    req.userEmail = req.userEmail.split("@")[0];
    const response = await axios.post(
      `${config.mlURL}/api/image_classifier/train`,
      {
        training_time: req.training_time,
        userEmail: req.userEmail,
        projectName: project.name,
        runName: run.name,
      }
    );
    const result = response.data;
    if (response.status === httpStatusCodes.OK) {
      console.log("Accuracy:", result.validation_accuracy);
      console.log("Time:", result.training_evaluation_time);

      project.validation_accuracy = result.validation_accuracy;
      project.status = "SUCCESS";
      run.status = "SUCCESS";
      run.val_accuracy = result.validation_accuracy;

      await db.getRepository(Run).save(run);
      await db.getRepository(Project).save(project);
    } else {
      run.status = "ERROR";
      await db.getRepository(Run).save(run);
    }
    return result;
  } catch (error) {
    console.error("Error communicating with ML service:", error);
    throw error;
  }
};

const predictProject = async (req: ProjectPredictRequest) => {
  try {
    if (req.image === undefined) {
      console.log("image is undefined");
      return null;
    }
    const project = await GetProjectFromId(req.projectId);
    if (!project) {
      console.error("Project not found");
      return null;
    }

    const formData = new FormData();
    formData.append("userEmail", req.userEmail.split("@")[0]);
    formData.append("projectName", project.name);
    formData.append("image", req.image, req.image.name);

    const response = await axios.post(
      `${config.mlURL}/api/image_classifier/predict`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error communicating with ML service:", error);
    throw error;
  }
};

const GetProjectFromId = async (id: string): Promise<Project | null> => {
  try {
    return await db.getRepository(Project).findOne({
      where: {
        id: id,
      },
    });
  } catch (error: any) {
    console.log(error);
    return null;
  }
};

export const ProjectServices = {
  createProject,
  getAllProject,
  TrainImageClassifierProject,
  GetProjectFromId,
  predictProject,
};
