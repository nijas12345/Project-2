import { Response } from "express";
import { HttpError } from "./HttpError"; // Adjust path
import HTTP_statusCode from "../Enums/httpStatusCode";

export function handleError(error: unknown, res: Response) {
    
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error("Unhandled Error:", error);
  return res
    .status(HTTP_statusCode.InternalServerError)
    .json({ message: "Something went wrong. Please try again later." });
}
