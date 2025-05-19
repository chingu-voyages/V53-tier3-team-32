import { Request, Response } from "express";
import { Menu } from "../models/schemas/Menu";
import mealApiService from "../services/mealApiService";
import { pdfService } from "../services/pdfService";

export const createWeeklyMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { startDate, endDate, weeklyMenu, override } = req.body;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      res.status(400).json({
        message: "Cannot create menu for past dates",
        success: false,
      });
      return;
    }

    if (!req.user?._id) {
      res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
      return;
    }

    const existingMenuQuery = {
      $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
      createdBy: req.user!._id,
    };

    const existingMenu = await Menu.findOne(existingMenuQuery);

    if (existingMenu) {
      if (override) {
        await Menu.deleteOne({
          _id: existingMenu._id,
          createdBy: req.user!._id,
        });
      } else {
        res.status(409).json({
          // Conflict
          success: false,
          message:
            "A menu already exists for these dates. Confirm to override.",
          requiresOverride: true,
        });
        return;
      }
    }

    const newMenuDoc = await Menu.create({
      startDate: start,
      endDate: end,
      weeklyMenu,
      createdBy: req.user!._id,
    });

    res.status(201).json({
      success: true,
      data: newMenuDoc,
    });
  } catch (err) {
    const error = err as Error;
    if (
      error.message.includes("Menu already exists for these dates") &&
      !override
    ) {
      res.status(409).json({
        success: false,
        message: error.message,
        requiresOverride: true,
      });
      return;
    }
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred",
    });
  }
};

export const updateDayMeals = async (req: Request, res: Response): Promise<void> => {
  const { menuId, dayName } = req.params;
  const { dishes } = req.body; // Expecting { dishes: ["meal1", "meal2", "meal3"] }

  if (!req.user?._id) {
    res.status(401).json({ message: "User not authenticated", success: false });
    return;
  }
  if (!Array.isArray(dishes) || dishes.length !== 3 || !dishes.every(d => typeof d === 'string')) {
    res.status(400).json({ message: "Invalid 'dishes' format.", success: false });
    return;
  }

  try {
    const menu = await Menu.findOne({ _id: menuId, createdBy: req.user._id });
    if (!menu) {
      res.status(404).json({ message: "Menu not found or user not authorized", success: false });
      return;
    }

    const dayToUpdate = menu.weeklyMenu.find(d => d.day === dayName);
    if (!dayToUpdate) {
      res.status(404).json({ message: `Day '${dayName}' not found in this menu`, success: false });
      return;
    }

    if (dayToUpdate.isDayOff) {
      res.status(400).json({ message: "Cannot edit meals for a day marked as 'Day Off'.", success: false });
      return;
    }

    dayToUpdate.dishes = dishes;
    menu.updated_at = new Date();
    await menu.save();

    res.status(200).json({ success: true, data: menu, message: `Meals for ${dayName} updated.` });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const getMenuForWeek = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { date } = req.query;

  try {
    const queryDate = new Date(date as string);
    queryDate.setHours(0, 0, 0, 0); // Normalize the time

    // Ensure the date is valid
    if (isNaN(queryDate.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
      return;
    }

    // Log the query for debugging
    console.log("Searching for menu with date:", queryDate);

    const menu = await Menu.findOne({
      startDate: { $lte: queryDate },
      endDate: { $gte: queryDate },
    });

    // Log the found menu
    console.log("Found menu:", menu);

    if (!menu) {
      res.status(404).json({
        success: false,
        message: "No menu found for this week",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: menu,
    });
  } catch (err) {
    console.error("Error in getMenuForWeek:", err);
    const error = err as Error;
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred",
    });
  }
};

export const getAllMenus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const menus = await Menu.find()
      .select("startDate endDate")
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      menus,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
};

export const generateWeeklyMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?._id) {
      res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
      return;
    }

    const { startDate, endDate } = req.body;

    // First, delete any existing menu for these dates
    await Menu.deleteOne({
      $or: [
        {
          startDate: { $lte: new Date(endDate) },
          endDate: { $gte: new Date(startDate) },
        },
      ],
    });

    // Get meals separated by type
    const meals = await mealApiService.getRandomMealsWithoutAllergies(35); // 7 breakfasts + 14 lunches + 14 dinners

    const weeklyMenuData = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].map((day, index) => ({
      day,
      dishes: [
        meals.breakfast[index]?.strMeal || "No breakfast available",
        meals.mainDishes[index]?.strMeal || "No lunch available",
        meals.mainDishes[index + 7]?.strMeal || "No dinner available",
      ],
      isDayOff: false,
    }));

    const newMenuDoc = await Menu.create({
      // Renamed variable to avoid conflict
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      weeklyMenu: weeklyMenuData,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: newMenuDoc,
    });
  } catch (error) {
    let errorMessage = "An error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

export const toggleDayOffStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { menuId, dayName } = req.params;

  if (!req.user?._id) {
    res.status(401).json({ message: "User not authenticated", success: false });
    return;
  }

  try {
    const menu = await Menu.findOne({ _id: menuId, createdBy: req.user._id });

    if (!menu) {
      res.status(404).json({
        message: "Menu not found or user not authorized",
        success: false,
      });
      return;
    }

    const dayToUpdate = menu.weeklyMenu.find((d) => d.day === dayName);

    if (!dayToUpdate) {
      res.status(404).json({
        message: `Day '${dayName}' not found in this menu`,
        success: false,
      });
      return;
    }

    dayToUpdate.isDayOff = !dayToUpdate.isDayOff;
    // if (dayToUpdate.isDayOff) { // Optionally clear dishes on backend too
    //   dayToUpdate.dishes = ["Day Off", "Day Off", "Day Off"];
    // }

    menu.updated_at = new Date();
    await menu.save();

    res.status(200).json({
      success: true,
      data: menu,
      message: `Successfully toggled Day Off status for ${dayName}.`,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    res.status(500).json({
      success: false,
      message: `Error toggling day off status: ${errorMessage}`,
    });
  }
};

export const exportMenuAsPDF = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { menuId } = req.query; // Expect menuId from query params

  if (!req.user?._id) {
    // This check should ideally be handled by authenticateJWT middleware first
    if (!res.headersSent) {
      res.status(401).json({ success: false, message: "User not authenticated" });
    }
    return;
  }

  if (!menuId || typeof menuId !== 'string') {
    if (!res.headersSent) {
      res.status(400).json({ success: false, message: "Menu ID is required for export." });
    }
    return;
  }

  try {
    const menu = await Menu.findOne({
      _id: menuId,
      createdBy: req.user._id, // Ensure user owns the menu
    });

    if (!menu) {
      if (!res.headersSent) {
        res.status(404).json({ success: false, message: "Menu not found or not authorized to export." });
      }
      return;
    }

    // Set headers *before* calling the service that will pipe to the response
    const startDateString = menu.startDate.toISOString().split('T')[0];
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=weekly-menu-${startDateString}.pdf`
    );

    // pdfService.generateMenuPdf is expected to pipe to 'res' and end it.
    pdfService.generateMenuPdf(menu, res);

  } catch (error) {
    console.error("Error exporting PDF:", error);
    // If headers have not been sent, we can send a JSON error response.
    // Otherwise, the stream is already being handled (or has ended), and we should not interfere.
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "An error occurred during PDF export.",
      });
    } else if (res.writable && !res.writableEnded) {
      // If headers were sent but stream is still writable and not ended (e.g., error during piping),
      // end the stream to prevent client hanging. Client might get partial/corrupt PDF.
      res.end();
    }
    // If headersSent and writableEnded, the stream was already closed, possibly by pdfService.generateMenuPdf or due to the error.
    // Logging the error is the main action here.
  }
};