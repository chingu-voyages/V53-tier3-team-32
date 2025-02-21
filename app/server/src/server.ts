import express, { Request, Response } from "express";
import { IndexRoute } from "./routes";
import DB from "./lib/DB";
import { authroute } from "./routes/auth";
import { menuRouter } from "./routes/menu";
import { AllergyRoute } from "./routes/allergy";
import { json } from "body-parser";
import passport from "passport";
const session = require("express-session");
import cors from "cors";
require("dotenv").config();

DB;

const app = express();
const port: number = Number(process.env.PORT) || 3000;

app.use(
  cors({
    origin: ["https://menu-scheduling-app.onrender.com", "https://menu-scheduler-backend.onrender.com"],
    credentials: true,
  })
);

app.use(passport.initialize());

app.use(
  session({
    secret: process.env.COOKIEKEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(json());
app.use("/", IndexRoute);
app.use("/auth", authroute);
app.use("/api/menu", menuRouter);
app.use("/api/allergy", AllergyRoute);

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});