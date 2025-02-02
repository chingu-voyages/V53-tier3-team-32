import { User } from "../models/schemas/User";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

async function createUser(req: Request, res: Response) {
  const { email, username, password } = req.body;

  const emailCheck = await User.find({ email });
  if (emailCheck.length > 0) {
    res.status(400).json({
      message: "E-mail address is already been used",
      success: false,
    });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    res.status(201).send({ message: "User created successfully", user });
  } catch (err) {
    res.status(404).send(err);
  }
}

export const signin = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  try {
    // Find the user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!user) {
      res.status(401).send({ message: "Invalid credentials" });
      return;
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).send({ message: "Invalid credentials" });
      return;
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).send({ token, message: "Signed in successfully", user });
  } catch (err) {
    res.status(500).send(err);
  }
};

export default { createUser, signin };