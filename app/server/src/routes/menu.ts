import { Router } from "express";
import { createWeeklyMenu, getMenuForWeek } from "../controllers/menu";
import { authenticateJWT } from "../middleware";
import { asyncHandler } from "../lib/asyncHandler";

const menuRouter = Router();

menuRouter.post("/", authenticateJWT, asyncHandler(createWeeklyMenu));
menuRouter.get("/", authenticateJWT, asyncHandler(getMenuForWeek));

export { menuRouter };