import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/database.js';

export class AnalyticsController {
  static async getAnalytics(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required.' });
      }

      const { range = '7d' } = req.query;
      const now = Date.now();
      let startTime = 0;

      if (range === '7d') {
        startTime = now - 7 * 24 * 60 * 60 * 1000;
      } else if (range === '30d') {
        startTime = now - 30 * 24 * 60 * 60 * 1000;
      } else if (range === '3m') {
        startTime = now - 90 * 24 * 60 * 60 * 1000;
      } else {
        startTime = 0; // all time
      }

      const userAnalyses = db
        .getAnalysesByUser(req.user.userId)
        .filter(a => new Date(a.createdAt).getTime() >= startTime);

      const totalMeals = userAnalyses.length;

      // Aggregates
      let totalCalories = 0;
      let totalProtein = 0;
      let totalCarbs = 0;
      let totalFat = 0;
      let totalFiber = 0;
      let totalSugar = 0;

      const dailyMap: Record<string, { date: string; calories: number; protein: number; carbs: number; fat: number; count: number }> = {};
      const foodFrequency: Record<string, { count: number; calories: number }> = {};
      const mealTypeDistribution: Record<string, number> = {
        Breakfast: 0,
        Lunch: 0,
        Dinner: 0,
        Snack: 0,
      };

      for (const item of userAnalyses) {
        const nut = item.totalNutrition;
        totalCalories += nut.calories || 0;
        totalProtein += nut.protein || 0;
        totalCarbs += nut.carbohydrates || 0;
        totalFat += nut.fat || 0;
        totalFiber += nut.fiber || 0;
        totalSugar += nut.sugar || 0;

        if (mealTypeDistribution[item.mealType] !== undefined) {
          mealTypeDistribution[item.mealType] += 1;
        }

        // Daily grouping
        const dateKey = new Date(item.createdAt).toISOString().split('T')[0];
        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = { date: dateKey, calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 };
        }
        dailyMap[dateKey].calories += nut.calories || 0;
        dailyMap[dateKey].protein += Math.round(nut.protein || 0);
        dailyMap[dateKey].carbs += Math.round(nut.carbohydrates || 0);
        dailyMap[dateKey].fat += Math.round(nut.fat || 0);
        dailyMap[dateKey].count += 1;

        // Food frequency
        for (const food of item.foods) {
          if (!foodFrequency[food.name]) {
            foodFrequency[food.name] = { count: 0, calories: 0 };
          }
          foodFrequency[food.name].count += 1;
          foodFrequency[food.name].calories += food.nutrition.calories || 0;
        }
      }

      // Convert daily map to sorted list
      const dailyCalories = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

      // Calculate distinct days for accurate daily averages
      const distinctDaysCount = Math.max(1, dailyCalories.length);

      const summary = {
        totalMealsAnalyzed: totalMeals,
        totalCalories,
        averageDailyCalories: Math.round(totalCalories / distinctDaysCount),
        averageProtein: Number((totalProtein / distinctDaysCount).toFixed(1)),
        averageCarbs: Number((totalCarbs / distinctDaysCount).toFixed(1)),
        averageFat: Number((totalFat / distinctDaysCount).toFixed(1)),
        averageFiber: Number((totalFiber / distinctDaysCount).toFixed(1)),
        averageSugar: Number((totalSugar / distinctDaysCount).toFixed(1)),
      };

      // Top foods
      const mostFrequentFoods = Object.entries(foodFrequency)
        .map(([name, data]) => ({ name, count: data.count, totalCalories: data.calories }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      // Macro breakdown
      const macroTotals = {
        protein: Math.round(totalProtein),
        carbs: Math.round(totalCarbs),
        fat: Math.round(totalFat),
      };

      return res.json({
        summary,
        dailyCalories,
        macroTotals,
        mealTypeDistribution,
        mostFrequentFoods,
        range,
      });
    } catch (err: any) {
      console.error('Analytics error:', err);
      return res.status(500).json({ error: 'Failed to compute analytics.' });
    }
  }
}
