import express, { Request, Response } from "express";
import { getUserAllergies, addUserAllergy } from "./api";
import { Router } from "express";

// Създаване на основно приложение
const app = express();

// Конфигуриране на Express за JSON
app.use(express.json());

// Създаване на Router за маршрути
export const authroute = Router();

authroute.get("/users/allergies", async (req: Request, res: Response) => {
  try {
    const { username } = req.query;
    if (typeof username === "string") {
      const allergies = await getUserAllergies(username);
      return res.json({ allergies });
    } else {
      return res.status(400).json({ error: "Username is required" });
    }
  } catch (error) {
    console.error("Error fetching allergies", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

authroute.post("/users/allergies", async (req: Request, res: Response) => {
  try {
    const { username, allergy } = req.body;
    if (typeof username === "string" && typeof allergy === "string") {
      await addUserAllergy(username, allergy);
      return res.status(200).json({ message: "Allergy added successfully" });
    } else {
      return res.status(400).json({ error: "Username and allergy are required" });
    }
  } catch (error) {
    console.error("Error adding allergy", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});