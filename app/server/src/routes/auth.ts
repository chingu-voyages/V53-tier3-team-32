import { Router } from "express";
import controller from "../controllers/auth";
import passport from "passport";
require("../lib/Github.auth");
require("../lib/Google.auth");
import controllers from "../controllers";
import { Request, Response } from "express";

export const authroute = Router();

authroute.get(
  "/github/",
  passport.authenticate("github", { scope: ["profile", "email"] }),
);
authroute.get(
  "/github/callback",
  passport.authenticate("github"),
  (req: Request, res: Response) => {
    res.redirect("/dashboard");
  },
);
authroute.get("/google/",passport.authenticate('google',{scope:['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/userinfo.email']}));
authroute.get(
  "/google/callback",
  passport.authenticate("google"),
  (req: Request, res: Response) => {
    res.redirect("/dashboard");
  },
);
