// express
import express from "express";

// dotenv
import { config } from "dotenv";

// middlewares
import errorMiddleware from "./middleware/error.js";
import authMiddleware from "./middleware/auth.js";
import sanitizeMiddleware from './middleware/sanitize.js';

// db
import connectDB from "./config/db.js";
// routes
import TaskRoutes from "./api/taskRoutes.js";
import UserRoutes from "./api/userRoutes.js";

// Security
import cors from "cors"
import csurf from "csurf"
import helmet from "helmet"
import rateLimit from "express-rate-limit";

config();
connectDB();

const app = express();
const csrfProtection = csurf({ cookie: true });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use(express.json());

// CORS
app.use(
  cors({
    origin: process.env.URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// CSURF
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    csrfProtection(req, res, next);
  } else {
    next();
  }
});

// helmet
app.use(helmet())

// limiter
app.use(limiter)

app.use(sanitizeMiddleware)

app.use("/account", UserRoutes);
app.use("/tasks", authMiddleware,TaskRoutes);

app.use(errorMiddleware);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
