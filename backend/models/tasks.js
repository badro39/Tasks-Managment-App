import { Schema, model } from "mongoose";

const taskSchema = new Schema({
    title: {type: String, required: true, trim: true},
    description: {type: String, trim: true},
    priority: {type: String, enum: ["Low", "Medium", "High"], default: "Medium"},
    dueDate: {type: Date, default: ()=> Date.now()},
    completed: {type: Boolean, default: false},
    user: {type: Schema.Types.ObjectId, ref: "User"}
}, {timestamps: true})

const Task = model("Task", taskSchema, "tasks")
export default Task