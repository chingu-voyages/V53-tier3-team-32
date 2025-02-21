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

// OAuth routes (should be public)
authroute.get(
  "/github/",
  passport.authenticate("github", { scope: ["profile", "email"] })
);
authroute.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/signin" }),
  (req: Request, res: Response) => {
    if (req.user) {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.redirect(
        `https://menu-scheduling-app.onrender.com/auth/callback?token=${token}`
      );
    } else {
      res.redirect("/signin");
    }
  }
);
authroute.get(
  "/google/",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);
authroute.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/signin" }),
  (req: Request, res: Response) => {
    if (req.user) {
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.redirect(
        `https://menu-scheduling-app.onrender.com/auth/callback?token=${token}`
      );
    } else {
      res.redirect("/signin");
    }
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
