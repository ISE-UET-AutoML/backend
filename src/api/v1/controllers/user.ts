import { UserRequest, UserServices } from "../services/user"; // Import the user services
import { Response as ExResponse } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import config from "../../../config";
import httpStatusCodes from "../errors/httpStatusCodes";
import {
  Body,
  BodyProp,
  Controller,
  Post,
  Response,
  Route,
  SuccessResponse,
} from "tsoa";

// const createUser = async (req: Request, res: Response) => {
//   try {
//     let { username, email, password } = req.body as UserRequest;
//     const existUser = await UserServices.findByEmail(email);
//     console.log("createUser:" + email + " - " + password);
//     if (existUser) {
//       res.status(httpStatusCodes.CONFLICT).json({
//         message: "User already exists",
//       });
//     } else {
//       password = await bcrypt.hash(password, 10);
//       const user = await UserServices.createUser({ username, email, password });

//       if (user === true) {
//         res.status(httpStatusCodes.CREATED).json({
//           message: "User created successfully",
//         });
//       } else {
//         res.status(httpStatusCodes.BAD_REQUEST).json({
//           message: "User could not be created, please check the provided data.",
//         });
//       }
//     }
//   } catch (error: any) {
//     console.error("User creation failed:", error);
//     res.status(500).json({
//       message: "An unexpected error occurred.",
//     });
//   }
// };

// const checkLogin = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body as UserRequest;
//     console.log("checkLogin: " + email + " .pass: " + password);
//     const user = await UserServices.findByEmail(email);
//     if (user === null) {
//       res.status(httpStatusCodes.NOT_FOUND).json({
//         message: "User not found",
//       });
//       return;
//     }
//     const match = await bcrypt.compare(password, user.password);
//     if (match) {
//       const accessToken = await generateToken(user, config.accessTokenRequest); // default is 365 days
//       res.status(httpStatusCodes.OK).json({
//         message: "User logged in successfully",
//         access_token: accessToken,
//       });
//     } else {
//       res.status(httpStatusCodes.UNAUTHORIZED).json({
//         message: "Incorrect password",
//       });
//     }
//   } catch (error: any) {
//     console.error("User login failed:", error);
//     res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
//       message: "An unexpected error occurred.",
//     });
//   }
// };

// export const UserController = {
//   createUser,
//   checkLogin,
// };

@Route("api/tsoa_v1/auth")
export class UserControllerTSOA extends Controller {
  // httpStatusCodes.CREATED: 201
  // using httpStatusCodes make tsoa not generate the correct response code and/or any response at all
  //@SuccessResponse(httpStatusCodes.CREATED, "User created successfully")
  @SuccessResponse(201, "User created successfully")
  @Response(400, "Error, please check the provided data.")
  @Response(409, "User already exists")
  @Response(500, "An unexpected error occurred.")
  @Post("/createUser")
  public async createUser(
    @BodyProp() username: string,
    @BodyProp() email: string,
    @BodyProp() password: string
  ): Promise<void> {
    try {
      //let { username, email, password } = req as UserRequest;
      const existUser = await UserServices.findByEmail(email);
      console.log("createUser:" + email + " - " + password);
      if (existUser) {
        this.setStatus(httpStatusCodes.CONFLICT);
      } else {
        password = await bcrypt.hash(password, 10);
        const user = await UserServices.createUser({
          username,
          email,
          password,
        });

        if (user === true) {
          this.setStatus(httpStatusCodes.CREATED);
        } else {
          this.setStatus(httpStatusCodes.BAD_REQUEST);
        }
      }
    } catch (error: any) {
      console.error("User creation failed:", error);
      this.setStatus(httpStatusCodes.INTERNAL_SERVER_ERROR);
    }
    Promise.resolve();
  }

  @SuccessResponse(200, "User logged in successfully")
  @Response(404, "User not found")
  @Response(401, "Incorrect password")
  @Response(500, "An unexpected error occurred.")
  @Post("/checkLogin")
  public async checkLogin(
    @BodyProp() email: string,
    @BodyProp() password: string
  ): Promise<any> {
    try {
      console.log("checkLogin: " + email + " .pass: " + password);
      const user = await UserServices.findByEmail(email);
      if (user === null) {
        this.setStatus(httpStatusCodes.NOT_FOUND);
        return {
          status: httpStatusCodes.NOT_FOUND,
          message: "User not found",
        };
      }
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const accessToken = await generateToken(
          user,
          config.accessTokenRequest
        ); // default is 365 days
        this.setStatus(httpStatusCodes.OK);
        return {
          status: httpStatusCodes.OK,
          message: "User logged in successfully",
          access_token: accessToken,
        };
      } else {
        this.setStatus(httpStatusCodes.UNAUTHORIZED);
        return {
          status: httpStatusCodes.UNAUTHORIZED,
          message: "Incorrect password",
        };
      }
    } catch (error: any) {
      console.error("User login failed:", error);
      this.setStatus(httpStatusCodes.INTERNAL_SERVER_ERROR);
      return {
        status: httpStatusCodes.INTERNAL_SERVER_ERROR,
        message: "An unexpected error occurred.",
      };
    }
    Promise.resolve();
  }
}
