require("dotenv").config();
import { User } from "../models/schemas/User";
import passport from "passport";
const GithubStrategy = require("passport-github").Strategy;

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://menu-scheduler-backend.onrender.com/auth/github/callback/",
    },
    async function (
      accessToken: String,
      refreshToken: String,
      profile: any,
      done: Function,
    ) {
      try {
        const currentUser = await User.findOne({ githubid: profile.id });

        if (currentUser) {
          console.log(currentUser + "has been found");
          return done(null, currentUser);
        }

        const newUser = await User.create({
          githubid: profile.id,
          email: profile.emails[0].value,
          username: profile.username,
        });

        console.log(newUser + "has been created");
        done(null, newUser);
      } catch (err) {
        console.log(err);
        done(err, null);
      }
    },
  ),
);

passport.serializeUser((user: any, done: Function) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: Function) => {
  try {
    const user = await User.findOne({_id: id }); // Replace with your DB logic
    done(null, user);
  } catch (error) {
    done(error);
  }
});
