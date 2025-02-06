require("dotenv").config();
import { User } from "../models/schemas/User";
import passport from "passport";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/callback/",
        },
        async function (
            accessToken: String,
            refreshToken: String,
            profile: any,
            done: Function,
        ) {
            try{
                console.log(profile);
                const currentUser = await User.findOne({googleid: profile.id});
                if(currentUser){
                    console.log(currentUser + "has been found");
                    return done(null, currentUser);
                }

                const newUser = await User.create({
                    googleid: profile.id,
                    email : profile.emails[0].value,
                    username: profile.displayName,
                });

                console.log(newUser + "created");
                done(null,newUser)
            }
            catch(err){
                console.log(err);
                done(err,null)
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
