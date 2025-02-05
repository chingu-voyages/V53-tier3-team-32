import { Request, Response } from "express";
import { Menu } from "../models/schemas/Menu";

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
