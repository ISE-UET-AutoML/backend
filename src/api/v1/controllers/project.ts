import {Request, Response} from "express"
import {ProjectTrainRequest, ProjectRequest, ProjectServices, ProjectPredictRequest} from "../services/project"
import httpStatusCodes from "../errors/httpStatusCodes";

const createProject = async (req: Request, res: Response) => {
    let {email, name, task, description} = req.body as ProjectRequest;
    try {
        const project = await ProjectServices.createProject({email, name, task, description});
        if (project) {
            res.status(httpStatusCodes.CREATED).json({
                project_name: project.name,
                project_id: project.id,
            });
        } else {
            res.status(httpStatusCodes.BAD_REQUEST).json({
                message: "Project could not be created, please check the provided data.",
            });
        }
    } catch (error: any) {
        console.error('Project creation failed:', error);
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An unexpected error occurred.",
        });
    }
}

const getAllProject = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const projects = await ProjectServices.getAllProject(email);
        if (projects) {
            const response = projects.map(project => ({
                id: project.id,
                name: project.name,
                description : project.description,
                updated_at : project.updated_at,
                status : project.status,
            }))
            res.status(httpStatusCodes.OK).json(response);
        } else {
            res.status(httpStatusCodes.BAD_REQUEST).json({
                message: "Could not be get all project from db.",
            });
        }
    } catch (error : any) {
        console.error('Get all project failed:', error);
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An unexpected error occurred.",
        });
    }
}

const trainProject = async (req: Request, res: Response) => {
    let {training_time, userEmail, projectId} = req.body as ProjectTrainRequest;
    console.log({training_time, userEmail, projectId});
    try {
        const response = await ProjectServices.TrainImageClassifierProject({training_time, userEmail, projectId});

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
        console.error('Project get info failed:', error);
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An unexpected error occurred.",
        });
    }
}

const predictProject = async (req: Request, res: Response) => {
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
        console.error('Project predict failed:', error);
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An unexpected error occurred.",
        });
    }
}
const getProjectById = async (req: Request, res: Response) => {
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
        console.error('Project get info failed:', error);
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An unexpected error occurred.",
        });
    }

}
export const ProjectController = {
    createProject,
    getAllProject,
    trainProject,
    predictProject,
    getProjectById
}