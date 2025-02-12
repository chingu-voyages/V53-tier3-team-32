export interface Allergy {
  name: string;
  category: 'fruits' | 'vegetables' | 'dairy' | 'meat' | 'grains' | 'spices' | 'beverages';
  count: number;
  created_at: Date;
  updated_at: Date;
}