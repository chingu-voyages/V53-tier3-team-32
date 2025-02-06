import { Router } from "express";
import controller from "../controllers/allergyController";

export const AllergyRoute = Router();

AllergyRoute.get("/create", controller.createAllergy);
AllergyRoute.get("/inc", controller.allergyCountInc);
AllergyRoute.get("/dec", controller.allergyCountDec);
AllergyRoute.get("/delete", controller.deleteAllergy);
