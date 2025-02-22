require("dotenv").config();
import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import User from "../models/schemas/User";
import IUser from "../models/interface/IUser";
import { VerifyCallback } from "passport-oauth2";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL:
        "https://menu-scheduler-backend.onrender.com/auth/github/callback",
      scope: ["user:email"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: VerifyCallback
    ) => {
      try {
        let user = await User.findOne({ githubid: profile.id });

        if (!user) {
          const email = profile.emails?.[0].value;
          const username =
            profile.username ||
            profile.displayName ||
            email?.split("@")[0] ||
            `user${profile.id}`;

          user = new User({
            githubid: profile.id,
            email: email!,
            username,
            role: "worker",
          });

          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done: Function) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: Function) => {
  try {
    const user = await User.findOne({ _id: id }); // Replace with your DB logic
    done(null, user);
  } catch (error) {
    done(error);
  }
});
