import User from "../Model/userModal";

import { Request, Response, NextFunction } from "express";
import UserRepository from "../Repositories/userRepository";
import HTTP_statusCode from "../Enums/httpStatusCode";
import { IUser } from "../Interfaces/commonInterface";

const userRepository = new UserRepository(User);

async function isBloked(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user_id = req.user_id;
    if (!user_id) {
      res
        .status(HTTP_statusCode.Unauthorized)
        .json({ message: "Access denied. User ID not found." });
      return;
    }
    const userData: IUser | null = await userRepository.userIsBlocked(user_id);
    if (!userData) throw new Error("No user Data");
    const isBlocked = userData.isBlocked;
    console.log("user is blocked => ", isBlocked);
    if (isBlocked === true) {
      res
        .status(HTTP_statusCode.Unauthorized)
        .json({ message: "Access denied. User is blocked." });
      return;
    }
    next();
  } catch (error) {
    res
      .status(HTTP_statusCode.InternalServerError)
      .json({ message: "Server error." });
    return;
  }
}

export default isBloked;
