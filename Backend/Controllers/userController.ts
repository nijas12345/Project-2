import { Request, Response } from "express";
import { IUserService } from "../Interfaces/user.service.interface";
import { IUser } from "../Interfaces/commonInterface";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { HttpError } from "../Utils/HttpError";
import { handleError } from "../Utils/handleError";
import { log } from "node:console";

class UserController {
  private userService: IUserService;
  constructor(userService: IUserService) {
    this.userService = userService;
  }
  register = async (req: Request, res: Response) => {
    try {
      const refferalCode = req.query.refferalCode as string | null;
      const userData: IUser = req.body;
      userData.refferalCode = refferalCode;
      await this.userService.register(userData);
      res.status(HTTP_statusCode.OK).send("OTP send to mail");
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  otpVerification = async (req: Request, res: Response) => {
    try {
      const enteredOTP: string = req.body.otp;
      console.log(enteredOTP);

      await this.userService.otpVerification(enteredOTP);
      res.status(HTTP_statusCode.OK).send();
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  resendOTP = async (req: Request, res: Response) => {
    try {
      await this.userService.resendOTP();
      res.status(HTTP_statusCode.OK).send("OTP sended");
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const serviceResponse = await this.userService.login(email, password);
      res.cookie("RefreshToken", serviceResponse.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("AccessToken", serviceResponse.userToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 30 * 60 * 1000,
      });
      res.status(HTTP_statusCode.OK).json(serviceResponse.userData);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  verifyGoogleAuth = async (req: Request, res: Response) => {
    try {
      const token: string = req.body.token as string;
      const serviceResponse = await this.userService.verifyGoogleAuth(token);

      res.cookie("RefreshToken", serviceResponse.refreshToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("AccessToken", serviceResponse.userToken, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 30 * 60 * 1000,
      });
      res.status(HTTP_statusCode.OK).json(serviceResponse.userData);
    } catch (error: unknown) {
      console.log("User:= google login error", error);
      handleError(error, res);
    }
  };
  resetPassword = async (req: Request, res: Response) => {
    try {
      const email: string = req.body.email;
      await this.userService.resetPassword(email);
      res.status(HTTP_statusCode.OK).send();
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  validateToken = async (req: Request, res: Response) => {
    try {
      const token = req.body.token;
      await this.userService.validateToken(token);
      res.status(HTTP_statusCode.OK).send();
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  confirmResetPassword = async (req: Request, res: Response) => {
    try {
      const token = req.body.token as string;
      const password = req.body.password as string;
      await this.userService.confirmResetPassword(token, password);
      res.status(HTTP_statusCode.OK).send();
    } catch(error:unknown) {
      handleError(error,res)
    }
  };
  updateUser = async (req: Request, res: Response) => {
    try {
      const user_id: string = req.user_id as string;
      const user: IUser = req.body;
      const serviceResponse = await this.userService.updateUser(user_id, user);
      console.log(serviceResponse);
      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie("AccessToken", {
        httpOnly: true,
      });
      res.clearCookie("RefreshToken", {
        httpOnly: true,
      });

      res.status(HTTP_statusCode.OK).json("Logged out successfully");
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  profilePicture = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const file = req.file;

      if (!file)
        throw new HttpError(HTTP_statusCode.BadRequest, "No file provided");

      const serviceResponse = await this.userService.profilePicture(
        user_id,
        file.path
      );

      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
  addRefferalCode = async (req: Request, res: Response) => {
    try {
      const user_id = req.user_id as string;
      const refferalCode = req.body.refferalCode;
      const serviceResponse = await this.userService.addRefferalCode(
        user_id,
        refferalCode
      );

      res.status(HTTP_statusCode.OK).json(serviceResponse);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };
}
export default UserController;
