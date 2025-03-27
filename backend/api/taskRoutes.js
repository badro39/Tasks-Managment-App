// express
import express from "express";

// express validator
import { check, validationResult } from "express-validator";
// middleware
import authMiddleware from "../middleware/auth.js";

// task model
import Task from "../models/tasks.js";

const router = express.Router();

const checkError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  next();
};

// get All Tasks
router
  .route("/")
  .get(async (req, res) => {
    const tasks = await Task.find();
    if (!tasks.length) return res.send("No Tasks Found!");

    res.json(tasks);
  })
  .post(
    authMiddleware,
    [check("title", "Title is required").notEmpty().trim()],
    checkError,
    async (req, res) => {
      const { title, description } = req.body;
      const task = await Task.create({
        title,
        description,
        user: req.user.id,
      });
      res.status(201).json(task);
    }
  );

// modify a task
router
  .route("/:id")
  .put(authMiddleware, async (req, res) => {
    const task = await Task.findById(req.params.id); // Get a single document
    if (!task) return res.status(404).json({ error: "Task Not Found!" });

    task.completed = true;
    await task.save(); // Save the updated task

    res.json({ message: "Task updated successfully!" }); // Send response
  })
  .delete(authMiddleware, async (req, res) => {
    const deletedTask = await Task.deleteOne({ _id: req.params.id });
    if (!deletedTask.deletedCount)
      return res.status(401).json({ error: "Task Did not deleted!" });
    res.json({ message: "Task Deleted!" });
  });

export default router;
