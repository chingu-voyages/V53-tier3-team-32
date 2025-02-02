import express, { Request, Response } from "express";
import { IndexRoute } from "./routes";
import DB from "./lib/DB";
import { authroute } from "./routes/auth";
import { json } from "body-parser";
import passport from "passport";
const session = require("express-session");
import cors from "cors";
require("dotenv").config();

DB;

const app = express();
const port: number = 3000;

app.use(
  cors({
    origin: "http://localhost:3001", // replace with your frontend's origin
    credentials: true,
  })
);


app.use(passport.initialize());

app.use(
  session({
    secret: process.env.COOKIEKEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' },
  })
);

app.use(json());
app.use("/", IndexRoute);
app.use("/auth", authroute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
