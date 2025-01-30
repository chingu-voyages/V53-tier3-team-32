import { Router } from "express";
import controller from "../controllers/index";

export const IndexRoute = Router();

IndexRoute.get('/',controller.index);
IndexRoute.get('/register',controller.register);


