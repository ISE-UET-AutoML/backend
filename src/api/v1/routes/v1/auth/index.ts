import { Router } from 'express';
import {UserController} from "../../../controllers/user";

const authRouter = Router();

authRouter.use('/register', UserController.createUser);
authRouter.use('/login', UserController.checkLogin);
export default authRouter;
