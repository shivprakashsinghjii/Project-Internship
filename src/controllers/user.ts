import { Request, Response, NextFunction } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";

interface ReturnResponse {
  status: "success" | "error";
  message: string;
  data: { userId?: string; user?: object };
}

const registerUser = async (req: Request, res: Response) => {
  let resp: ReturnResponse;
  try {
      const email=req.body.email;
      const name=req.body.name;
      let password=await bcrypt.hash(req.body.password,12);


    const user = new User({email,name,password});
    const result = await user.save();

    if (!result) {
      resp = { status: "error", message: "No result found", data: {} };
      res.send(resp);
    } else {
      resp = { status: "success", message: "Registration successful", data: { userId: result._id.toString() } };
      res.send(resp);
    }
  } catch (error) {
    resp = { status: "error", message: "Something went wrong", data: {} };
    res.status(500).send(resp);
  }
};

const getUser = async (req: Request, res: Response) => {
  let resp: ReturnResponse;
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, { name: 1, email: 1 });

    if (!user) {
      resp = { status: "error", message: "No result found", data: {} };
      res.send(resp);
    } else {
      resp = { status: "success", message: "User found", data: { user } };
      res.send(resp);
    }
  } catch (error) {
    resp = { status: "error", message: "Something went wrong", data: {} };
    res.status(500).send(resp);
  }
};

const updateUser = async (req: Request, res: Response) => {
  let resp: ReturnResponse;
  try {
    const userId = req.body._id;
    const user = await User.findById(userId);

    if (user) {
      if (req.body.name) {
        user.name = req.body.name;
      }
      await user.save();
      resp = { status: "success", message: "User updated", data:  {} };
    } else {
      resp = { status: "error", message: "User not found", data: {} };
    }

    res.send(resp);
  } catch (error) {
    console.log(error);
    resp = { status: "error", message: "Something went wrong", data: {} };
    res.status(500).send(resp);
  }
};


export { registerUser, getUser, updateUser };
