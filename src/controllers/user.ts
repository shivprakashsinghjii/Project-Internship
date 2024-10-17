import { RequestHandler } from "express";
import User from "../models/user";
import { Request,Response,NextFunction } from "express";

import ProjectError from "../helper/error";

interface ReturnResponse {
  status: "success" | "error";
  message: string;
  data: { userId?: string; user?: object; token?: string  };
}



const getUser: RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
  let resp: ReturnResponse;
  // console.log(req.userId);
  try {
    const userId = req.params.userId;
    if(req.userId!=req.params.userId)
    {
      const error=new ProjectError("Function noy")
      error.statusCode=401;
      error.data={hi:"its Error"};
      throw error;
    }
    const user = await User.findById(userId, { name: 1, email: 1 });

    resp = user
      ? { status: "success", message: "User found", data: { user } }
      : { status: "error", message: "No result found", data: {} };

    res.send(resp);
  } catch (error) {
    next(error);
  }
};

const updateUser: RequestHandler = async (req:Request, res:Response, next:NextFunction) => {
  let resp: ReturnResponse;
  try {
    if(req.userId!=req.body._id)
      {
        const err= new ProjectError("not authorised");
        err.statusCode=401; 
        throw err;
      }
    const { _id: userId, name } = req.body;
    const user = await User.findById(userId);

    if (user) {
      if (name) user.name = name;
      await user.save();
      resp = { status: "success", message: "User updated", data: {} };
    } else {
      resp = { status: "error", message: "User not found", data: {} };
    }

    res.send(resp);
  } catch (error) {
    // // console.error(error);
    // resp = { status: "error", message: "Something went wrong", data: {} };
    // res.status(500).send(resp);
    next(error);
  }
};

export {  getUser, updateUser };
