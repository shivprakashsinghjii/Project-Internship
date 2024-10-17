import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      throw new Error("Not Authenticated");
    }

    const token = authHeader?.split(' ')[1];
    let decodedToken: { userId: string; iat: number; exp: number };

    try {
      decodedToken = jwt.verify(token, "secretmyverysecretkey") as typeof decodedToken;
    } catch (error) {
      throw new Error("Not Authenticated");
    }

    if (!decodedToken) {
      throw new Error("Not Authenticated");
    }

    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    next(error);
  }
};

export { isAuthenticated };
