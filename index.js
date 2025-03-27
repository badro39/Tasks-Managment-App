// express
import express from "express"

// dotenv
import { config } from "dotenv";

// middlewares
import errorMiddleware from "./middleware/error.js"

// db
import connectDB from "./config/db.js"
// routes
import UserRoutes from "./api/userRoutes.js"
import TaskRoutes from "./api/taskRoutes.js"

config()
connectDB()

const app = express()
app.use(express.json())


app.use("/account", UserRoutes)
app.use("/tasks", TaskRoutes)

app.use(errorMiddleware)
const PORT = process.env.PORT || 8000
app.listen(PORT, ()=>{
    console.log(`server is running on port: ${PORT}`)
})