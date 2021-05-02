import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const permissionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization)
    return res.status(403).json({
      message: "No permisos: no se proporciono token",
    });

  const token = req.headers.authorization.split(" ")[1];
  try {
    verify(token, process.env.JWT_SECRET || "secret");
    return next();
  } catch (e) {
    return res.status(400).json({
      message: e.message,
    });
  }
};
