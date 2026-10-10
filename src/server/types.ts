export type Role = 'user' | 'admin';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface NutritionData {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface DetectedFood {
  name: string;
  estimated_quantity: number;
  unit: string; // 'g' | 'ml' | 'piece' | 'cup' | 'slice'
  confidence: number; // 0 to 1.0
  nutrition: NutritionData;
}

export interface Analysis {
  _id: string;
  userId: string;
  imageUrl: string;
  mealType: MealType;
  foods: DetectedFood[];
  totalNutrition: NutritionData;
  aiConfidence: number;
  explanation: string;
  portionUncertain: boolean;
  notes?: string;
  isDemo?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FoodItem {
  _id: string;
  name: string;
  category: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  sugarPer100g: number;
  servingUnit: string;
  servingSizeGrams: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string; // bcrypt hash
  role: Role;
  profileImage: string;
  isActive: boolean;
  calorieGoal?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: Role;
  name: string;
}
