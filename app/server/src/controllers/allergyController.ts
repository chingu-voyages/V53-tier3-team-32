import { Allergy } from "../models/schemas/Allergy";
import { Request, Response } from "express";

// Add allergy to collection
const createAllergy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    
    if (!name) {
      res.status(400).json({ msg: "Name is required" });
      return;
    }

    const allergyExists = await Allergy.findOne({ name: name });
    if (allergyExists) {
      res.status(400).json({ msg: "Allergy already exists" });
      return;
    }

    const newAllergy = await Allergy.create({ name });
    res.status(201).json({ 
      msg: "Allergy added successfully",
      allergy: newAllergy 
    });
  } catch (error) {
    res.status(500).json({ 
      msg: "Server error",
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// Remove allergy from collection
const deleteAllergy = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    
    if (!name) {
      res.status(400).json({ msg: "Name is required" });
      return;
    }

    const allergyExists = await Allergy.findOne({ name: name });
    if (!allergyExists) {
      res.status(404).json({ msg: "Allergy not found" });
      return;
    }

    const deletedAllergy = await Allergy.deleteOne({ name: name });
    if (deletedAllergy.deletedCount > 0) {
      res.status(200).json({ msg: "Allergy deleted successfully" });
    } else {
      res.status(400).json({ msg: "Error deleting allergy" });
    }
  } catch (error) {
    res.status(500).json({ 
      msg: "Server error",
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// Increment allergy count
const allergyCountInc = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    
    if (!name) {
      res.status(400).json({ msg: "Name is required" });
      return;
    }

    const result = await Allergy.updateOne(
      { name: name },
      { $inc: { count: 1 } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ msg: "Count updated successfully" });
    } else {
      res.status(400).json({ msg: "Allergy not found" });
    }
  } catch (error) {
    res.status(500).json({ 
      msg: "Server error",
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// Decrement allergy count
const allergyCountDec = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    
    if (!name) {
      res.status(400).json({ msg: "Name is required" });
      return;
    }

    const result = await Allergy.updateOne(
      { name: name },
      { $inc: { count: -1 } }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ msg: "Count updated successfully" });
    } else {
      res.status(400).json({ msg: "Allergy not found" });
    }
  } catch (error) {
    res.status(500).json({ 
      msg: "Server error",
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

// Get top allergies
const getTopAllergies = async (req: Request, res: Response): Promise<void> => {
  try {
    const topAllergies = await Allergy.find()
      .sort({ count: -1 })
      .limit(5);
    res.status(200).json({ allergies: topAllergies });
  } catch (error) {
    res.status(500).json({ 
      msg: "Server error",
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
};

export default {
  createAllergy,
  deleteAllergy,
  allergyCountInc,
  allergyCountDec,
  getTopAllergies,
};