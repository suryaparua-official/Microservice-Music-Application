import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import multer from "multer";

interface AdminJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const isAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Please login" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Please login" });
    return;
  }

  const jwtSecret = process.env.JWT_SEC;
  if (!jwtSecret) {
    res.status(500).json({ message: "Server misconfigured" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as AdminJwtPayload;
    req.user = { _id: decoded.id, role: decoded.role };
    next();
  } catch {
    res.status(401).json({ message: "Please login" });
  }
};

// 50 MB limit matches nginx client_max_body_size
const storage = multer.memoryStorage();
const uploadFile = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
}).single("file");

export default uploadFile;
