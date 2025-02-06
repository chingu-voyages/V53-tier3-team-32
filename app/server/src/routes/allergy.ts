import { Router } from "express";
import controller from "../controllers/allergyController";
import { asyncHandler } from "../lib/asyncHandler";

export const AllergyRoute = Router();

AllergyRoute.post("/create", asyncHandler(controller.createAllergy));
AllergyRoute.post("/inc", asyncHandler(controller.allergyCountInc));
AllergyRoute.post("/dec", asyncHandler(controller.allergyCountDec));
AllergyRoute.delete("/delete", asyncHandler(controller.deleteAllergy));
AllergyRoute.get("/top5", asyncHandler(controller.getTopAllergies));