import { Router } from "express";
import controller from "../controllers/auth";
import passport from "passport";
require("../lib/Github.auth");
require("../lib/Google.auth");
import { Request, Response } from "express";
import { authenticateJWT } from "../middleware";
import { asyncHandler } from "../lib/asyncHandler";
import jwt from "jsonwebtoken";

export const authroute = Router();

// Public auth routes
authroute.post("/signup", asyncHandler(controller.createUser));
authroute.post("/signin", asyncHandler(controller.signin));

// Helper function to generate JWT token
const generateToken = (user: any) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

// Google Auth Routes
authroute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authroute.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response) => {
    const token = generateToken(req.user);
    res.redirect(`https://menu-scheduling-app.onrender.com/?token=${token}`);
  }
);

// GitHub Auth Routes
authroute.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authroute.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req: Request, res: Response) => {
    const token = generateToken(req.user);
    res.redirect(`https://menu-scheduling-app.onrender.com/?token=${token}`);
  }
);

// Now apply JWT middleware for protected routes
authroute.use(authenticateJWT);

authroute.get("/logout", (req: Request, res: Response) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    if (req.session) {
      req.session.destroy(() => {
        res.redirect("https://menu-scheduling-app.onrender.com/signin");
      });
    } else {
      res.redirect("https://menu-scheduling-app.onrender.com/signin");
    }
  });
});
