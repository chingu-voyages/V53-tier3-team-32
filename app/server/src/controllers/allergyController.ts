import { Request, Response } from "express";
import { Allergy } from "../models/schemas/Allergy";

export const createAllergy = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, category } = req.body;

  try {
    const allergy = new Allergy({ name, category });
    await allergy.save();
    res.status(201).json({ success: true, msg: "Allergy created", allergy });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      msg: error?.message || "Error creating allergy",
    });
  }
};

export const getAllergies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allergies = await Allergy.find()
      .sort({ category: 1, name: 1 })
      .collation({ locale: "en", strength: 2 });

    res.status(200).json({ success: true, allergies });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      msg: error?.message || "Error fetching allergies",
    });
  }
};

export const createAllergiesByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validCategories = [
    "fruits",
    "vegetables",
    "dairy",
    "meat",
    "grains",
    "spices",
    "beverages",
  ];

  try {
    const allergiesData = req.body;

    if (!Array.isArray(allergiesData)) {
      res.status(400).json({
        success: false,
        msg: "Invalid input format. Expected array of allergies",
      });
      return;
    }

    // Validate categories
    const invalidCategories = allergiesData.filter(
      ({ category }) => !validCategories.includes(category)
    );

    if (invalidCategories.length > 0) {
      res.status(400).json({
        success: false,
        msg: `Invalid categories found: ${invalidCategories
          .map((a) => a.category)
          .join(", ")}. Valid categories are: ${validCategories.join(", ")}`,
      });
      return;
    }

    const savedAllergies = await Promise.all(
      allergiesData.map(async ({ name, category }) => {
        if (!name || !category) {
          throw new Error("Name and category are required for each allergy");
        }

        // Convert name to lowercase for consistent comparison
        const lowerName = name.toLowerCase().trim();

        // Try to find existing allergy with case-insensitive search
        const existingAllergy = await Allergy.findOne({
          name: { $regex: new RegExp(`^${lowerName}$`, "i") },
          category,
        });

        if (existingAllergy) {
          // Increment count if allergy exists
          existingAllergy.count += 1;
          await existingAllergy.save();
          return existingAllergy;
        } else {
          // Create new allergy if it doesn't exist, starting with count 1
          const allergy = await Allergy.create({
            name: lowerName,
            category,
            count: 1,
          });
          return allergy;
        }
      })
    );

    res.status(201).json({
      success: true,
      msg: "Allergies processed successfully",
      allergies: savedAllergies,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      msg: error?.message || "Error processing allergies",
    });
  }
};
