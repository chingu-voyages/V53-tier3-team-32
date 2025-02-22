import { Router } from "express";
import controller from "../controllers/auth";
import passport from "passport";
require("../lib/Github.auth");
require("../lib/Google.auth");
import { Request, Response } from "express";
import { authenticateJWT } from "../middleware";
import { asyncHandler } from "../lib/asyncHandler";
import jwt from "jsonwebtoken";
import IUser from "../models/interface/IUser";

export const authroute = Router();

// Add OAuth routes
authroute.get("/google", passport.authenticate("google", { session: false }));

authroute.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/signin",
  }),
  (req, res) => {
    const user = req.user as IUser;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Encode the token and frontend URL
    const encodedToken = encodeURIComponent(token);
    const frontendUrl = `https://menu-scheduling-app.onrender.com/signin?token=${encodedToken}`;

    res.redirect(frontendUrl);
  }
);

authroute.get(
  "/github",
  passport.authenticate("github", { session: false, scope: ["user:email"] })
);

authroute.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/signin",
  }),
  (req, res) => {
    const user = req.user as IUser;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    res.redirect(
      `https://menu-scheduling-app.onrender.com/signin?token=${token}`
    );
  }
);

// routes/auth.ts
authroute.get(
  "/verify",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ valid: true, user: req.user });
  })
);

// Public auth routes
authroute.post("/signup", asyncHandler(controller.createUser));
authroute.post("/signin", asyncHandler(controller.signin));

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
