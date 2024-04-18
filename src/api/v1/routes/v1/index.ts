import {Router} from 'express'
import authRouter from "./auth";
import projectRouter from './project';
import isAuth from '../../middlewares/auth';
import runRouter from './run';

const routeV1: Router = Router()

routeV1.use('/auth', authRouter);
routeV1.use('/projects', projectRouter);
try {
    routeV1.use('/runs', runRouter);
} catch (e: any) {
    console.log(e);
}
export default routeV1
