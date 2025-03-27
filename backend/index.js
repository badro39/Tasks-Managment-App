// express
import express from "express";

// CORS
import cors from "cors"

// dotenv
import { config } from "dotenv";

// middlewares
import errorMiddleware from "./middleware/error.js";

// db
import connectDB from "./config/db.js";

// routes
import TaskRoutes from "./api/taskRoutes.js";
import UserRoutes from "./api/userRoutes.js";

config();
connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/account", UserRoutes);
app.use("/tasks", TaskRoutes);

app.use(errorMiddleware);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
