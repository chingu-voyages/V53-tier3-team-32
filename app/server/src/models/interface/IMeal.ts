export interface Meal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string;
  strIngredient1: string | null;
  strIngredient2: string | null;
  // ... add up to strIngredient20
  strIngredient20: string | null;
  strMeasure1: string | null;
  strMeasure2: string | null;
  // ... add up to strMeasure20
  strMeasure20: string | null;
  strSource: string | null;
  dateModified: string | null;
}
