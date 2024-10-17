import { RequestHandler } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request,Response,NextFunction } from "express";
import ProjectError from "../helper/error";
import { validationResult } from "express-validator";

interface ReturnResponse {
  status: "success" | "error";
  message: string;
  data: { userId?: string; user?: object; token?: string  };
}
const registerUser: RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
  let resp: ReturnResponse;
  try {
    const validationError=validationResult(req);
    if(!validationError.isEmpty()){
      const err=new ProjectError("Validation Failed");
      err.statusCode=422;
      err.data=validationError.array();
      throw err;
    }

    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, name, password: hashedPassword });
    const result = await user.save();

    resp = result
      ? { status: "success", message: "Registration successful", data: { userId: result._id.toString() } }
      : { status: "error", message: "No result found", data: {} };
      
    res.send(resp);
  } catch (error) {
    next(error);
  }
};

const loginUser: RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
  let resp: ReturnResponse;
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      const err=new ProjectError("No user exist");
      err.statusCode=401;
      throw err;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = jwt.sign({ userId: user._id }, "secretmyverysecretkey", { expiresIn: "1h" });
      resp = {
        status: "success",
        message: "Login successful",
        data: { userId: user._id.toString(), token }
      };
      res.status(200).send(resp);
    } else {
      const err=new ProjectError("credential mismatch");
      err.statusCode=401;
      throw err;
    }
  } catch (error) {
     next(error);
  }
};

export { registerUser, loginUser};