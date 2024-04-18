import { db } from "../db";
import { Project, Run } from "../models";

const getAllRun = async (id: string): Promise<Run[] | null> => {
    try {
        const project = await db.getRepository(Project).findOne({
            where: {
                id: id
            }
        })
        console.log(project);
        if (!project) {
            console.error('Project not found');
            return null;
        }
        const runs = await db.getRepository(Run)
            .createQueryBuilder('run')
            .where('run.project.id = :projectId', { projectId: project.id })
            .getMany();

        console.log(runs);
        return runs;
    } catch (error: any) {
        console.error("Error to get all data from run table");
        throw error;
    }
};

export const RunService = {
    getAllRun,
}