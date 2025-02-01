import express, { Request, Response } from "express";
import DB from "./lib/DB";
import { json } from "body-parser";
import passport from 'passport';
const session  = require('express-session');
require("dotenv").config();

import router from "./routes/index";

DB;

const app = express();
const port: number = 3000;

app.use(passport.initialize());

app.use(
  session({
 	secret: process.env.COOKIEKEY,
	resave: false,
	saveUninitialized: true,
	cookie: {secure: true}
  }),
);

app.use(json());
app.use("/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
}); 
