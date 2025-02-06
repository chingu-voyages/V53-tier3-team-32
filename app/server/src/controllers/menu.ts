import { Request, Response } from "express";
import { Menu } from "../models/schemas/Menu";
import mealApiService from "../services/mealApiService";
import { pdfService } from "../services/pdfService";

export const createWeeklyMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { startDate, endDate, weeklyMenu } = req.body;

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

    if (!req.user?.id) {
      res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
      return;
    }

    const menu = await Menu.create({
      startDate,
      endDate,
      weeklyMenu,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: menu,
    });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred",
    });
  }
};

export const getMenuForWeek = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { date } = req.query;

  try {
    const queryDate = new Date(date as string);
    const menu = await Menu.findOne({
      startDate: { $lte: queryDate },
      endDate: { $gte: queryDate },
    });

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
    const error = err as Error;
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred",
    });
  }
};

export const generateWeeklyMenu = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user?.id) {
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

    // Get 21 random meals (3 meals per day for 7 days)
    const meals = await mealApiService.getRandomMealsWithoutAllergies(21);

    const weeklyMenu = [
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
        meals[index * 3].strMeal, // Breakfast
        meals[index * 3 + 1].strMeal, // Lunch
        meals[index * 3 + 2].strMeal, // Dinner
      ],
    }));

    const menu = await Menu.create({
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      weeklyMenu,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: menu,
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

export const exportMenuAsPDF = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const menu = await Menu.findOne({
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (!menu) {
      res.status(404).json({ message: "No current menu found" });
      return;
    }

    pdfService.generateMenuPdf(menu, res);
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
