import axios from "axios";
import { Meal } from "../models/interface/IMeal";
import { MealApiResponse } from "../models/interface/IMealApiResponse";
import { Allergy } from "../models/schemas/Allergy";

class MealApiService {
  private readonly BASE_URL = "https://www.themealdb.com/api/json/v1/1";
  
  private readonly MAIN_DISH_CATEGORIES = [
    "Beef",
    "Chicken",
    "Lamb",
    "Pork",
    "Seafood",
    "Pasta",
    "Vegetarian"
  ];

  async getMealsByCategory(category: string): Promise<Meal[]> {
    const response = await axios.get<MealApiResponse>(
      `${this.BASE_URL}/filter.php?c=${category}`
    );
    return response.data.meals || [];
  }

  private getMealIngredients(meal: Meal): string[] {
    const ingredients: string[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof Meal];
      if (ingredient && ingredient.trim()) {
        ingredients.push(ingredient.toLowerCase());
      }
    }
    return ingredients;
  }

  async getRandomMealsWithoutAllergies(count: number): Promise<{
    breakfast: Meal[];
    mainDishes: Meal[];
  }> {
    try {
      // Get breakfast meals
      const breakfastMeals = await this.getRandomMealsWithoutAllergiesByCategory(7, "Breakfast");

      // Get main dishes from multiple categories
      const mainDishPromises = this.MAIN_DISH_CATEGORIES.map(category =>
        this.getRandomMealsWithoutAllergiesByCategory(4, category)
      );

      const mainMealsArrays = await Promise.all(mainDishPromises);
      const allMainMeals = mainMealsArrays.flat();

      // Shuffle and ensure unique meals
      const shuffledMainMeals = this.shuffleArray(allMainMeals);
      const uniqueMainMeals = Array.from(
        new Set(shuffledMainMeals.map(meal => meal.idMeal))
      )
        .map(id => shuffledMainMeals.find(meal => meal.idMeal === id))
        .filter(meal => meal) as Meal[];

      // Take enough meals for lunch and dinner (14 each)
      const mainDishes = uniqueMainMeals.slice(0, 28);

      return {
        breakfast: breakfastMeals,
        mainDishes
      };
    } catch (error) {
      console.error("Error fetching meals:", error);
      throw error;
    }
  }

  async getRandomMealsWithoutAllergiesByCategory(
    count: number,
    category: string
  ): Promise<Meal[]> {
    const allergies = await Allergy.find({ count: { $gt: 0 } }).select("name");
    const allergyNames = allergies.map((a) => a.name.toLowerCase());

    let allCategoryMeals = await this.getMealsByCategory(category);
    // Shuffle all meals randomly
    allCategoryMeals = this.shuffleArray(allCategoryMeals);

    const selectedMeals: Meal[] = [];
    const usedMealIds = new Set();

    for (const meal of allCategoryMeals) {
      if (selectedMeals.length >= count) break;

      if (!usedMealIds.has(meal.idMeal)) {
        const fullMealResponse = await axios.get<MealApiResponse>(
          `${this.BASE_URL}/lookup.php?i=${meal.idMeal}`
        );
        const fullMeal = fullMealResponse.data.meals?.[0];

        if (fullMeal) {
          const ingredients = this.getMealIngredients(fullMeal);
          const hasAllergy = ingredients.some((ingredient) =>
            allergyNames.includes(ingredient)
          );

          if (!hasAllergy) {
            selectedMeals.push(fullMeal);
            usedMealIds.add(meal.idMeal);
          }
        }
      }
    }

    return selectedMeals;
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

export default new MealApiService();