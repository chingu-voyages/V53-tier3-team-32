import { Meal } from './IMeal';

export interface MealApiResponse {
  meals: Meal[] | null;
}