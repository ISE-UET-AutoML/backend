import { UserRequest, UserServices } from "../services/user"; // Import the user services
import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { generateToken } from "../utils/jwt";
import config from "../../../config";
import httpStatusCodes from "../errors/httpStatusCodes";

const createUser = async (req: Request, res: Response) => {
    try {
        let { username, email, password } = req.body as UserRequest;
        const existUser = await UserServices.findByEmail(email);
        if (existUser) {
            res.status(httpStatusCodes.CONFLICT).json({
                message: "User already exists",
            });
        } else {

            password = await bcrypt.hash(password, 10);
            const user = await UserServices.createUser({ username, email, password });

            if (user === true) {
                res.status(httpStatusCodes.CREATED).json({
                    message: "User created successfully",
                });
            } else {
                res.status(httpStatusCodes.BAD_REQUEST).json({
                    message: "User could not be created, please check the provided data.",
                });
            }
        }

    } catch (error: any) {
        console.error('User creation failed:', error);
        res.status(500).json({
            message: "An unexpected error occurred.",
        });
    }
};

const checkLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as UserRequest;
        const user = await UserServices.findByEmail(email);
        if (user === null) {
            res.status(httpStatusCodes.NOT_FOUND).json({
                message: "User not found",
            });
            return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            const accessToken = await generateToken(user, config.accessTokenRequest) // default is 365 days
            res.status(httpStatusCodes.OK).json({
                message: "User logged in successfully",
                access_token: accessToken,
            });
        } else {
            res.status(httpStatusCodes.UNAUTHORIZED).json({
                message: "Incorrect password",
            });
        }
    } catch (error: any) {
        console.error('User login failed:', error);
        res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An unexpected error occurred.",
        });
    }
}


export const UserController = {
    createUser,
    checkLogin
};