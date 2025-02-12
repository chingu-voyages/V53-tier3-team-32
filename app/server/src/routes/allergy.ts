import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import * as allergyController from "../controllers/allergyController";

export const AllergyRoute = Router();

AllergyRoute.post("/create", asyncHandler(allergyController.createAllergy));
AllergyRoute.get("/allergies", asyncHandler(allergyController.getAllergies));
AllergyRoute.post("/add-category", asyncHandler(allergyController.createAllergiesByCategory));

export default AllergyRoute;