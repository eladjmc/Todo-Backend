import express from "express";
import dotenv from "dotenv";
import connectDB from './config/db.js';
import users from "./routes/userRoutes.js"
import Todos from "./routes/todoRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js";
import cors from 'cors';

dotenv.config();

connectDB();

const DEV_PORT = 5000;
const port = DEV_PORT;

const app = express();

app.use(cors());
app.use(express.json()); // Body parser middleware

app.use('/api/v1/users', users);
app.use('/api/v1/todos', Todos);

app.use(errorHandler); // Error handler middleware

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
