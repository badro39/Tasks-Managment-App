import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: String,
    email: {type: String, required: true, unique: true, lowercase: true},
    password: { type: String, required: true }
})

const User = model("User", userSchema, "user")
export default User