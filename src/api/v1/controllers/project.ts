import { Request as ExRequest, Response as ExRespone } from "express";
import {
  ProjectTrainRequest,
  ProjectRequest,
  ProjectServices,
  ProjectPredictRequest,
} from "../services/project";
import httpStatusCodes from "../errors/httpStatusCodes";
import {
  Body,
  BodyProp,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Response,
  Tags,
  Res,
} from "tsoa";

const createProject = async (req: ExRequest, res: ExRespone) => {
  let { email, name, task, description } = req.body as ProjectRequest;
  try {
    const project = await ProjectServices.createProject({
      email,
      name,
      task,
      description,
    });
    if (project) {
      res.status(httpStatusCodes.CREATED).json({
        project_name: project.name,
        project_id: project.id,
      });
    } else {
      res.status(httpStatusCodes.BAD_REQUEST).json({
        message:
          "Project could not be created, please check the provided data.",
      });
    }
  } catch (error: any) {
    console.error("Project creation failed:", error);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
};

const getAllProject = async (req: ExRequest, res: ExRespone) => {
  try {
    const { email } = req.body;
    const projects = await ProjectServices.getAllProject(email);
    if (projects) {
      const response = projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        updated_at: project.updated_at,
        status: project.status,
      }));
      res.status(httpStatusCodes.OK).json(response);
    } else {
      res.status(httpStatusCodes.BAD_REQUEST).json({
        message: "Could not be get all project from db.",
      });
    }
  } catch (error: any) {
    console.error("Get all project failed:", error);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
};

const trainProject = async (req: ExRequest, res: ExRespone) => {
  let { training_time, userEmail, projectId } = req.body as ProjectTrainRequest;
  console.log({ training_time, userEmail, projectId });
  try {
    const response = await ProjectServices.TrainImageClassifierProject({
      training_time,
      userEmail,
      projectId,
    });

    if (response) {
      res.status(httpStatusCodes.OK).json({
        validation_accuracy: response.validation_accuracy,
        training_evaluation_time: response.training_evaluation_time,
      });
    } else {
      res.status(httpStatusCodes.BAD_REQUEST).json({
        message: "An unexpected error occurred.",
      });
    }
  } catch (error: any) {
    console.error("Project get info failed:", error);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
};
const trainImageClassificationProject = async (
  req: ExRequest,
  res: ExRespone
) => {
  let { training_time, userEmail, projectId } = req.body as ProjectTrainRequest;
  console.log({ training_time, userEmail, projectId });
  try {
    const response = await ProjectServices.TrainImageClassifierProject({
      training_time,
      userEmail,
      projectId,
    });

    if (response) {
      res.status(httpStatusCodes.OK).json({
        validation_accuracy: response.validation_accuracy,
        training_evaluation_time: response.training_evaluation_time,
      });
    } else {
      res.status(httpStatusCodes.BAD_REQUEST).json({
        message: "An unexpected error occurred.",
      });
    }
  } catch (error: any) {
    console.error("Project get info failed:", error);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
};
const trainTabularClassificationProject = async (
  req: ExRequest,
  res: ExRespone
) => {
  let { training_time, userEmail, projectId } = req.body as ProjectTrainRequest;
  console.log({ training_time, userEmail, projectId });
  try {
    const response = await ProjectServices.TrainTabularClassifierProject({
      training_time,
      userEmail,
      projectId,
      //TODO
      //label
    });

    if (response) {
      res.status(httpStatusCodes.OK).json({
        validation_accuracy: response.validation_accuracy,
        training_evaluation_time: response.training_evaluation_time,
      });
    } else {
      res.status(httpStatusCodes.BAD_REQUEST).json({
        message: "An unexpected error occurred.",
      });
    }
  } catch (error: any) {
    console.error("Project get info failed:", error);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
};
const predictProject = async (req: ExRequest, res: ExRespone) => {
  try {
    const predictRequest = req.body as ProjectPredictRequest;
    const response = await ProjectServices.predictProject(predictRequest);
    if (response) {
      res.status(httpStatusCodes.OK).json({
        message: "Predict project successfully",
        result: response.result,
      });
    } else {
      res.status(httpStatusCodes.BAD_REQUEST).json({
        message: "An unexpected error occurred.",
      });
    }
  } catch (error: any) {
    console.error("Project predict failed:", error);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
};
const getProjectById = async (req: ExRequest, res: ExRespone) => {
  try {
    const Id = req.params.projectId;
    const project = await ProjectServices.GetProjectFromId(Id);
    if (project) {
      res.status(httpStatusCodes.OK).json({
        message: "Get project successfully",
        project: project,
      });
    } else {
      res.status(httpStatusCodes.BAD_REQUEST).json({
        message: "An unexpected error occurred.",
      });
    }
  } catch (error: any) {
    console.error("Project get info failed:", error);
    res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred.",
    });
  }
};

export const ProjectController = {
  createProject,
  getAllProject,
  trainProject,
  trainImageClassificationProject,
  trainTabularClassificationProject,
  predictProject,
  getProjectById,
};

@Route("projects")
@Tags("Project")
export class TSOA_ProjectController extends Controller {
  @SuccessResponse(201, "Project created successfully")
  @Response(
    400,
    "Project could not be created, please check the provided data."
  )
  @Response(500, "An unexpected error occurred.")
  @Post("createProject")
  public async createProject(
    @BodyProp() email: string = "automl_test@gmail.com",
    @BodyProp() name: string = "automl_test_project",
    @BodyProp() task: string = "image_classification",
    @BodyProp() description: string = ""
  ): Promise<any> {
    try {
      const project = await ProjectServices.createProject({
        email,
        name,
        task,
        description,
      });
      if (project) {
        this.setStatus(httpStatusCodes.CREATED);
        return {
          project_name: project.name,
          project_id: project.id,
        };
      } else {
        this.setStatus(httpStatusCodes.BAD_REQUEST);
        return {
          message:
            "Project could not be created, please check the provided data.",
        };
      }
    } catch (error: any) {
      console.error("Project creation failed:", error);
      this.setStatus(httpStatusCodes.INTERNAL_SERVER_ERROR);
      return {
        message: "An unexpected error occurred.",
      };
    }
  }

  @SuccessResponse(200, "Get all project successfully")
  @Response(400, "Could not be get all project from db.")
  @Response(500, "An unexpected error occurred.")
  @Post("getAllProject")
  public async getAllProject(@BodyProp() email: string): Promise<any> {
    try {
      const projects = await ProjectServices.getAllProject(email);
      if (projects) {
        const response = projects.map((project) => ({
          id: project.id,
          name: project.name,
          description: project.description,
          updated_at: project.updated_at,
          status: project.status,
        }));
        this.setStatus(httpStatusCodes.OK);
        return response;
      } else {
        this.setStatus(httpStatusCodes.BAD_REQUEST);
        return {
          message: "Could not be get all project from db.",
        };
      }
    } catch (error: any) {
      console.error("Get all project failed:", error);
      this.setStatus(httpStatusCodes.INTERNAL_SERVER_ERROR);
      return {
        message: "An unexpected error occurred.",
      };
    }
  }
}
