import express from 'express';
import mongoose from 'mongoose';

import UserRoute from "./routes/user";

const app = express();

const connectionString = process.env.CONNECTION_STRING || "";

app.use(express.json());
app.get('/', (req, res) => {
  res.send("Hi Hello");
});
app.use('/user', UserRoute);

mongoose.connect(connectionString)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server connected and MongoDB connected");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
