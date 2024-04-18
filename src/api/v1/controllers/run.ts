import {Request, Response} from "express"
import httpStatusCodes from "../errors/httpStatusCodes";
import { RunService } from "../services/run";

const getAllRun = async (req: Request, res: Response) => {
    try {
        const { project_id } = req.body;
        const runs = await RunService.getAllRun(project_id);
        if (runs) {
            const response = runs.map(run => ({
                id: run.id,
                name: run.name,
                status : run.status,
                val_accuracy : run.val_accuracy,
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

export const RunController = {
    getAllRun,
}