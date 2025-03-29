import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;
  if (!token) {
     res.status(401).json({ error: "Unauthorized" }); 
     return; // Explicit return to prevent further execution
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.body.userId = (decoded as { userId: string }).userId;
    next(); // Explicit next() to continue
    return; // Explicit return to prevent further execution
  } catch {
     res.status(401).json({ error: "Invalid token" }); 
     return; // Explicit return to prevent further execution
  }
};
