import { Router } from "express";
import { UserController } from "../../../controllers/user";

const authRouter = Router();
/**
 * @openapi
 * /api/v1/auth/register:
 *   post:
 *    tags:
 *    - authentication
 *    description:
 *   requestBody:
 *    required: true
 *   parameters:
 *   - name: username
 *     in: formData
 *     required: true
 *     type: string
 *   - name: email
 *     in: formData
 *     required: true
 *     type: string
 *   - name: password
 *     in: formData
 *     required: true
 *     type: string
 */
authRouter.use("/register", UserController.createUser);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - authentication
 *     description:
 *   requestBody:
 *     required: true
 *   parameters:
 *     - name: email
 *       in: formData
 *       required: true
 *       type: string
 *     - name: password
 *       in: formData
 *       required: true
 *       type: string
 */
authRouter.use("/login", UserController.checkLogin);
export default authRouter;
