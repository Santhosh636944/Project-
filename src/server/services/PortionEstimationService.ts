import { DetectedFood, NutritionData } from '../types.js';
import { db } from '../db/database.js';

export class PortionEstimationService {
  /**
   * Recalculates nutritional values for a given food item and quantity.
   * If available in the database, uses standard nutritional data per 100g.
   * Otherwise, scales the existing nutritional data proportionally.
   */
  static recalculateItemNutrition(
    foodName: string,
    quantity: number,
    unit: string,
    existingNutrition?: NutritionData,
    originalQuantity?: number
  ): NutritionData {
    const dbFood = db.findFoodByName(foodName);

    // Convert common units to approximate grams
    const grams = this.convertToGrams(quantity, unit, dbFood?.servingSizeGrams);

    if (dbFood) {
      const factor = grams / 100;
      return {
        calories: Math.round(dbFood.caloriesPer100g * factor),
        protein: Number((dbFood.proteinPer100g * factor).toFixed(1)),
        carbohydrates: Number((dbFood.carbsPer100g * factor).toFixed(1)),
        fat: Number((dbFood.fatPer100g * factor).toFixed(1)),
        fiber: Number((dbFood.fiberPer100g * factor).toFixed(1)),
        sugar: Number((dbFood.sugarPer100g * factor).toFixed(1))
      };
    }

    // Fallback: proportional scaling if existingNutrition is provided
    if (existingNutrition && originalQuantity && originalQuantity > 0) {
      const scale = quantity / originalQuantity;
      return {
        calories: Math.round(existingNutrition.calories * scale),
        protein: Number((existingNutrition.protein * scale).toFixed(1)),
        carbohydrates: Number((existingNutrition.carbohydrates * scale).toFixed(1)),
        fat: Number((existingNutrition.fat * scale).toFixed(1)),
        fiber: Number((existingNutrition.fiber * scale).toFixed(1)),
        sugar: Number((existingNutrition.sugar * scale).toFixed(1))
      };
    }

    // Default estimate per 100g generic mixed food
    const genericFactor = grams / 100;
    return {
      calories: Math.round(150 * genericFactor),
      protein: Number((5 * genericFactor).toFixed(1)),
      carbohydrates: Number((20 * genericFactor).toFixed(1)),
      fat: Number((5 * genericFactor).toFixed(1)),
      fiber: Number((2 * genericFactor).toFixed(1)),
      sugar: Number((2 * genericFactor).toFixed(1))
    };
  }

  /**
   * Converts varied portion units into grams
   */
  static convertToGrams(quantity: number, unit: string, standardServingGrams?: number): number {
    const u = unit.toLowerCase().trim();
    if (u === 'g' || u === 'gram' || u === 'grams') return quantity;
    if (u === 'ml' || u === 'milliliter' || u === 'milliliters') return quantity; // approx 1ml ~ 1g for liquids
    if (u === 'piece' || u === 'pieces' || u === 'item') {
      return quantity * (standardServingGrams || 100);
    }
    if (u === 'cup' || u === 'cups') return quantity * 160;
    if (u === 'slice' || u === 'slices') return quantity * 35;
    if (u === 'bowl' || u === 'bowls') return quantity * 200;
    if (u === 'plate' || u === 'plates') return quantity * 300;
    if (u === 'tbsp' || u === 'tablespoon') return quantity * 15;
    if (u === 'tsp' || u === 'teaspoon') return quantity * 5;
    return quantity;
  }

  /**
   * Calculates the total nutritional values across a list of detected food items
   */
  static calculateTotals(foods: DetectedFood[]): NutritionData {
    return foods.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.nutrition?.calories || 0),
        protein: Number((acc.protein + (item.nutrition?.protein || 0)).toFixed(1)),
        carbohydrates: Number((acc.carbohydrates + (item.nutrition?.carbohydrates || 0)).toFixed(1)),
        fat: Number((acc.fat + (item.nutrition?.fat || 0)).toFixed(1)),
        fiber: Number((acc.fiber + (item.nutrition?.fiber || 0)).toFixed(1)),
        sugar: Number((acc.sugar + (item.nutrition?.sugar || 0)).toFixed(1))
      }),
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sugar: 0 }
    );
  }
}
