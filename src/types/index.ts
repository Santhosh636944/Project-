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
  unit: string;
  confidence: number;
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
  role: Role;
  profileImage: string;
  isActive: boolean;
  calorieGoal?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsSummary {
  totalMealsAnalyzed: number;
  totalCalories: number;
  averageDailyCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageFiber: number;
  averageSugar: number;
}

export interface DailyCaloriePoint {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  count: number;
}

export interface AnalyticsResponse {
  summary: AnalyticsSummary;
  dailyCalories: DailyCaloriePoint[];
  macroTotals: {
    protein: number;
    carbs: number;
    fat: number;
  };
  mealTypeDistribution: Record<string, number>;
  mostFrequentFoods: Array<{ name: string; count: number; totalCalories: number }>;
  range: string;
}
