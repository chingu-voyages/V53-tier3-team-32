require("dotenv").config();
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback } from 'passport-google-oauth20';
import { User } from '../models/schemas/User';
import jwt from 'jsonwebtoken';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "https://menu-scheduler-backend.onrender.com/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: GoogleProfile,
      done: VerifyCallback
    ) => {
      try {
        const existingUser = await User.findOne({ googleid: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const email = profile.emails?.[0]?.value;
        const username = profile.displayName || email?.split('@')[0];

        if (!email || !username) {
          return done(new Error('Email and username are required'));
        }

        const newUser = await User.create({
          googleid: profile.id,
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
    const user = await User.findOne({ _id: id }); // Replace with your DB logic
    done(null, user);
  } catch (error) {
    done(error);
  }
});
