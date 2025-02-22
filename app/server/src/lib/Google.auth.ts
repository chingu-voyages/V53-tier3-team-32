require("dotenv").config();
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/schemas/User";
import { IUser } from "../models/interface/IUser";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "https://menu-scheduler-backend.onrender.com/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleid: profile.id });
        
        if (!user) {
          const email = profile.emails?.[0].value;
          const username = profile.displayName || email?.split("@")[0] || `user${profile.id}`;
          
          user = new User({
            googleid: profile.id,
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
