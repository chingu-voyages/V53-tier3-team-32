import { Router } from "express";
import {
  createWeeklyMenu,
  getAllMenus,
  getMenuForWeek,
  generateWeeklyMenu,
  exportMenuAsPDF,
  toggleDayOffStatus,
  updateDayMeals,
} from "../controllers/menu";
import { authenticateJWT } from "../middleware";
import { asyncHandler } from "../lib/asyncHandler";

const menuRouter = Router();

menuRouter.post("/", authenticateJWT, asyncHandler(createWeeklyMenu));
menuRouter.get("/", authenticateJWT, asyncHandler(getMenuForWeek));
menuRouter.get("/all", authenticateJWT, asyncHandler(getAllMenus));
menuRouter.post("/generate", authenticateJWT, asyncHandler(generateWeeklyMenu));
menuRouter.get("/export", authenticateJWT, asyncHandler(exportMenuAsPDF));
menuRouter.put(
  "/:menuId/day/:dayName/toggle-off",
  authenticateJWT,
  asyncHandler(toggleDayOffStatus)
);
menuRouter.put(
  "/:menuId/day/:dayName/meals",
  authenticateJWT,
  asyncHandler(updateDayMeals)
);

export { menuRouter };
