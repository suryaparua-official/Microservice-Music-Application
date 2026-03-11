import type { NextFunction, Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: string;
  playlist: string[];
}

interface AuthRequest extends Request {
  user?: IUser | null;
}

export const isAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Please login" });
      return;
    }

    const { data } = await axios.get(
      `${process.env.User_URL}/api/users/user/me`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    req.user = data;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Please login",
    });
  }
};

// multer setup
import multer from "multer";

const storage = multer.memoryStorage();

const uploadFile = multer({ storage }).single("file");

export default uploadFile;
