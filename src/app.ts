import express from 'express';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from "express";
import ProjectError from './helper/error';
import UserRoute from "./routes/user";
import authRoute from "./routes/auth";
import quizRoute from "./routes/quiz";

const app = express();

interface ReturnResponse {
  status: "success" | "error";
  message: string;  // Ensure lowercase `string` here
  data: { userId?: string; user?: object; token?: string };
}

const connectionString = process.env.CONNECTION_STRING || "";

app.use(express.json());

declare global {
  namespace Express {
    interface Request {
      userId: string; // Corrected type to `string`
    }
  }
}

app.get('/', (req, res) => {
  res.send("Hi Hello");
});

app.use('/user', UserRoute);
app.use('/auth', authRoute);
app.use('/quiz', quizRoute);

// Error Handling Middleware
app.use((err: ProjectError, req: Request, res: Response, next: NextFunction) => {
  let message: string; // Use lowercase `string` here
  let statusCode: number;

  if (err.statusCode && err.statusCode < 500) {
    message = err.message;
    statusCode = err.statusCode;
  } else {
    message = "Yes Error";
    statusCode = 500;
  }

  const resp: ReturnResponse = { status: "error", message, data: {} };
  if (err.data) {
    resp.data = err.data;
  }
  console.log(err.statusCode, err.message);
  res.status(statusCode).send(resp);
});

mongoose.connect(connectionString)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server connected and MongoDB connected");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
