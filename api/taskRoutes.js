// express
import express from "express";

// express validator
import { check, validationResult } from "express-validator";

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
  .get(async (req, res, next) => {
    try {
      const tasks = await Task.find();
      if (!tasks.length)
        return res.status(404).json({ message: "No Tasks Found!" });

      return res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  })
  .post(
    [check("title", "Title is required").notEmpty().trim()],
    checkError,
    async (req, res, next) => {
      const { title, description, dueDate } = req.sanitizedBody;
      try {
        await Task.create({
          title,
          description,
          dueDate,
          user: req.user.id,
        });
        return res.status(201).json({ success: true });
      } catch (err) {
        next(err);
      }
    }
  );

// modify a task
router
  .route("/:id")
  .put(async (req, res, next) => {
    try {
      const task = await Task.findById(req.params.id); // Get a single document
      if (!task) return res.status(404).json({ error: "Task Not Found!" });

      task.completed = true;
      await task.save(); // Save the updated task

      return res.status(201).json({ message: "Task updated successfully!" }); // Send response
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const deletedTask = await Task.deleteOne({ _id: req.params.id });
      if (!deletedTask.deletedCount)
        return res.status(404).json({ error: "Task Did not deleted!" });
      res.json({ message: "Task Deleted!" });
    } catch (err) {
      next(err);
    }
  });

export default router;
