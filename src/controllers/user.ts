import { RequestHandler } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface ReturnResponse {
  status: "success" | "error";
  message: string;
  data: { userId?: string; user?: object; token?: string  };
}

const registerUser: RequestHandler = async (req, res) => {
  let resp: ReturnResponse;
  try {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, name, password: hashedPassword });
    const result = await user.save();

    resp = result
      ? { status: "success", message: "Registration successful", data: { userId: result._id.toString() } }
      : { status: "error", message: "No result found", data: {} };
      
    res.send(resp);
  } catch (error) {
    resp = { status: "error", message: "Something went wrong", data: {} };
    res.status(500).send(resp);
  }
};

const loginUser: RequestHandler = async (req, res) => {
  let resp: ReturnResponse;
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      resp = { status: "error", message: "User not found", data: {} };
      res.status(404).send(resp);
      return;
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
      resp = { status: "error", message: "Invalid credentials", data: {} };
      res.status(401).send(resp);
    }
  } catch (error) {
    console.error(error);
    resp = { status: "error", message: "Something went wrong", data: {} };
    res.status(500).send(resp);
  }
};

const getUser: RequestHandler = async (req, res) => {
  let resp: ReturnResponse;
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId, { name: 1, email: 1 });

    resp = user
      ? { status: "success", message: "User found", data: { user } }
      : { status: "error", message: "No result found", data: {} };

    res.send(resp);
  } catch (error) {
    resp = { status: "error", message: "Something went wrong", data: {} };
    res.status(500).send(resp);
  }
};

const updateUser: RequestHandler = async (req, res) => {
  let resp: ReturnResponse;
  try {
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
    console.error(error);
    resp = { status: "error", message: "Something went wrong", data: {} };
    res.status(500).send(resp);
  }
};

export { registerUser, loginUser, getUser, updateUser };
