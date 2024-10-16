import express from 'express';
import mongoose from 'mongoose';

import UserRoute from "./routes/user";

const app = express();

const connectionString = "mongodb+srv://spshiv2202:12345@shiva.wvtydyr.mongodb.net/YourDatabaseName?retryWrites=true&w=majority&appName=Shiva";

app.use(express.json());
app.get('/', (req, res) => {
  res.send("Hi Hello");
});
app.use('/user', UserRoute);

mongoose.connect(connectionString)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server connected and MongoDB connected");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
