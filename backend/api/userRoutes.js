import bcrypt from "bcrypt";
import express from "express";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

const router = express.Router();

const checkError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  next();
};

// Signup
router.post(
  "/signup",
  [
    check("name", "Name is required").notEmpty(),
    check("email", "Invalid Credential").isEmail(),
    check("password", "Password min length is 10").isLength({ min: 10 }),
  ],
  checkError,
  async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    if (!user) return res.status(404).json({ message: "Error while signup" });
    res.status(201).json({ message: "User Created Successfully!" });
  }
);

// Signin
router.post(
  "/signin",
  [
    check("email", "Invalid Credential").isEmail(),
    check("password", "Password min length is 10").isLength({ min: 10 }),
  ],
  checkError,
  async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // check if user exist
    if (!user) return res.status(401).json({ error: "Invalid Credential!" });

    const isValidPass = await bcrypt.compare(password, user.password);
    if (!isValidPass)
      return res.status(401).json({ message: "Invalid Credential!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  }
);

// get all users
router.get("/users", async (req, res) => {
  const users = await User.find();
  if (!users.length) return res.status(404).json({ error: "No User Found!" });
  res.json(users);
});

export default router;
