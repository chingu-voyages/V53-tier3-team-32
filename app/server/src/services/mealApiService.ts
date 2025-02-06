import axios from 'axios';
import { Meal } from '../models/interface/IMeal';
import { MealApiResponse } from '../models/interface/IMealApiResponse';
import { Allergy } from '../models/schemas/Allergy';

class MealApiService {
  private readonly BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

  async getRandomMeal(): Promise<Meal> {
    const response = await axios.get<MealApiResponse>(`${this.BASE_URL}/random.php`);
    const meals = response.data.meals;
    if (!meals) {
      throw new Error('No meals found');
    }
    return meals[0];
  }

  async searchMealsByName(name: string): Promise<Meal[]> {
    const response = await axios.get<MealApiResponse>(`${this.BASE_URL}/search.php?s=${name}`);
    return response.data.meals || [];
  }

  async getMealsByFirstLetter(letter: string): Promise<Meal[]> {
    const response = await axios.get<MealApiResponse>(`${this.BASE_URL}/search.php?f=${letter}`);
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

  async getRandomMealsWithoutAllergies(count: number): Promise<Meal[]> {
    const allergies = await Allergy.find({ count: { $gt: 0 } }).select('name');
    const allergyNames = allergies.map(a => a.name.toLowerCase());

    const meals: Meal[] = [];
    while (meals.length < count) {
      const meal = await this.getRandomMeal();
      const ingredients = this.getMealIngredients(meal);
      const hasAllergy = ingredients.some(ingredient => allergyNames.includes(ingredient));
      if (!hasAllergy) {
        meals.push(meal);
      }
    }
    return meals;
  }
}

export default new MealApiService();