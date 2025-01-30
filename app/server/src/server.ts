import express, { Request, Response } from "express";
import { IndexRoute } from "./routes";
import DB from "./lib/DB";
import { authroute } from "./routes/auth";
import { json } from "body-parser";
const cookieSession = require("cookie-session");
require("dotenv").config();

DB;

const app = express();
const port: number = 3000;

app.use(
  cookieSession({
    // age of the cookie in milliseconds
    // cookie will last for one day
    maxAge: 24 * 60 * 60 * 1000,
    // encrypts the user id
    keys: [process.env.COOKIEKEY],
  }),
);

app.use(json());
app.use("/", IndexRoute);
app.use("/auth", authroute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
