import {NextFunction, Request, Response} from "express";
import {verifyToken} from "../utils/jwt";
import config from "../../../config";

interface AuthenticatedRequest extends Request {
    user?: TokenPayLoad;
}

export type TokenPayLoad = {
    id: string;
    name: string;
    email: string;
};

const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const {accessToken} = req.cookies;
    console.log("accessToken here " + accessToken);
    if (accessToken) {
        try {
            req.user = await verifyToken(accessToken, config.accessTokenRequest);
            next();
        } catch (error: any) {
            return res.status(401).json({error: error.message});
        }
    } else {
        return res.sendStatus(403);
    }
}

export default isAuth;