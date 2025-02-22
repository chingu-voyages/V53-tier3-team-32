require("dotenv").config();
import passport from 'passport';
import { Strategy as GitHubStrategy, Profile as GitHubProfile } from 'passport-github2';
import { User } from '../models/schemas/User';

// Define the done callback type
type GitHubVerifyCallback = (error: any, user?: any, options?: any) => void;

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: "https://menu-scheduler-backend.onrender.com/auth/github/callback",
      scope: ['user:email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: GitHubVerifyCallback
    ) => {
      try {
        const existingUser = await User.findOne({ githubid: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const email = profile.emails?.[0]?.value;
        const username = profile.username || email?.split('@')[0];

        if (!email || !username) {
          return done(new Error('Email and username are required'));
        }

        const newUser = await User.create({
          githubid: profile.id,
          email,
          username,
        });

        return done(null, newUser);
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
    const user = await User.findOne({_id: id }); // Replace with your DB logic
    done(null, user);
  } catch (error) {
    done(error);
  }
});
