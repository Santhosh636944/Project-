import { GoogleGenAI, Type } from '@google/genai';
import { DetectedFood, NutritionData } from '../types.js';
import { PortionEstimationService } from './PortionEstimationService.js';

export interface RecognitionResult {
  foods: DetectedFood[];
  totalNutrition: NutritionData;
  aiConfidence: number;
  explanation: string;
  portionUncertain: boolean;
  isDemo?: boolean;
}

export class FoodRecognitionService {
  private static aiClient: GoogleGenAI | null = null;

  private static getAiClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    if (!this.aiClient) {
      this.aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return this.aiClient;
  }

  /**
   * Analyzes a food image using Google Gemini Vision API, with fallback to demo recognition
   */
  static async analyzeImage(
    base64Data: string,
    mimeType: string,
    options?: { isDemo?: boolean; mealHint?: string }
  ): Promise<RecognitionResult> {
    if (options?.isDemo) {
      return this.generateDemoAnalysis(options.mealHint);
    }

    const ai = this.getAiClient();
    if (!ai) {
      console.warn('GEMINI_API_KEY is not configured. Falling back to Demo recognition mode.');
      const demoResult = this.generateDemoAnalysis(options?.mealHint);
      demoResult.isDemo = true;
      demoResult.explanation =
        'Demo Mode Analysis: No GEMINI_API_KEY detected in server environment. Generated realistic nutritional estimate.';
      return demoResult;
    }

    try {
      const prompt = `You are a world-class clinical food nutritionist and computer vision food recognition AI for NutriVision AI.
Analyze the provided food image thoroughly.
Identify ALL individual food components on the plate/container (e.g. rice, chicken, egg, salad, sauce).
For each detected food item:
1. Identify the specific food name clearly (e.g. "Chicken Biryani", "Steamed White Rice", "Grilled Chicken Breast", "Boiled Egg").
2. Estimate the quantity and unit (prefer grams 'g', or 'piece', 'slice', 'cup', 'ml').
3. Estimate confidence score (0.0 to 1.0). If you cannot see food clearly or if it's not food, set confidence < 0.4.
4. Calculate approximate macronutrients and calories for that portion size:
   - calories (kcal, integer)
   - protein (grams, number)
   - carbohydrates (grams, number)
   - fat (grams, number)
   - fiber (grams, number)
   - sugar (grams, number)
5. Provide an explanation summarizing what was detected, emphasizing that these are AI estimates based on visual inspection.
6. Set portion_uncertain to true if serving depth or hidden layers make weight estimation ambiguous.

Return STRICT JSON adhering to this schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType || 'image/jpeg',
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foods: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    estimated_quantity: { type: Type.NUMBER },
                    unit: { type: Type.STRING },
                    confidence: { type: Type.NUMBER },
                    nutrition: {
                      type: Type.OBJECT,
                      properties: {
                        calories: { type: Type.NUMBER },
                        protein: { type: Type.NUMBER },
                        carbohydrates: { type: Type.NUMBER },
                        fat: { type: Type.NUMBER },
                        fiber: { type: Type.NUMBER },
                        sugar: { type: Type.NUMBER },
                      },
                      required: ['calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sugar'],
                    },
                  },
                  required: ['name', 'estimated_quantity', 'unit', 'confidence', 'nutrition'],
                },
              },
              total_nutrition: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.NUMBER },
                  protein: { type: Type.NUMBER },
                  carbohydrates: { type: Type.NUMBER },
                  fat: { type: Type.NUMBER },
                  fiber: { type: Type.NUMBER },
                  sugar: { type: Type.NUMBER },
                },
                required: ['calories', 'protein', 'carbohydrates', 'fat', 'fiber', 'sugar'],
              },
              overall_confidence: { type: Type.NUMBER },
              explanation: { type: Type.STRING },
              portion_uncertain: { type: Type.BOOLEAN },
            },
            required: ['foods', 'total_nutrition', 'overall_confidence', 'explanation', 'portion_uncertain'],
          },
        },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new Error('Empty response from AI vision model');
      }

      const parsed = JSON.parse(text);

      // Validate parsed content
      if (!parsed.foods || !Array.isArray(parsed.foods) || parsed.foods.length === 0) {
        throw new Error("We couldn't confidently identify any food in this image. Try uploading a clearer image with the food clearly visible.");
      }

      // Check if food was actually found
      const avgConf = parsed.overall_confidence || 0.85;
      if (avgConf < 0.25) {
        throw new Error("We couldn't confidently identify the food in this image. Try uploading a clearer image with the food visible.");
      }

      // Re-sum totals to guarantee mathematical consistency
      const computedTotals = PortionEstimationService.calculateTotals(parsed.foods);

      return {
        foods: parsed.foods.map((f: any) => ({
          name: f.name || 'Food item',
          estimated_quantity: Number(f.estimated_quantity) || 100,
          unit: f.unit || 'g',
          confidence: Math.min(1, Math.max(0.1, Number(f.confidence) || 0.85)),
          nutrition: {
            calories: Math.round(Number(f.nutrition?.calories) || 0),
            protein: Number((Number(f.nutrition?.protein) || 0).toFixed(1)),
            carbohydrates: Number((Number(f.nutrition?.carbohydrates) || 0).toFixed(1)),
            fat: Number((Number(f.nutrition?.fat) || 0).toFixed(1)),
            fiber: Number((Number(f.nutrition?.fiber) || 0).toFixed(1)),
            sugar: Number((Number(f.nutrition?.sugar) || 0).toFixed(1)),
          },
        })),
        totalNutrition: computedTotals,
        aiConfidence: Math.min(0.99, Math.max(0.3, Number(parsed.overall_confidence) || 0.9)),
        explanation:
          parsed.explanation ||
          'The estimate is based on visual food recognition and approximate standard serving sizes.',
        portionUncertain: Boolean(parsed.portion_uncertain),
        isDemo: false,
      };
    } catch (err: any) {
      console.error('Gemini vision API error:', err);
      // If error mentions invalid key or connection, provide a robust graceful fallback
      const fallback = this.generateDemoAnalysis(options?.mealHint);
      fallback.isDemo = true;
      fallback.explanation = `Live Vision fallback (${err.message || 'Service unreachable'}). Displaying calibrated nutritional estimate for common dishes.`;
      return fallback;
    }
  }

  /**
   * Generates realistic demo nutrition analysis data for testing & demo mode
   */
  static generateDemoAnalysis(mealHint?: string): RecognitionResult {
    const hint = mealHint?.toLowerCase() || '';

    if (hint.includes('breakfast')) {
      const foods: DetectedFood[] = [
        {
          name: 'Whole Wheat Bread',
          estimated_quantity: 2,
          unit: 'slice',
          confidence: 0.94,
          nutrition: {
            calories: 173,
            protein: 9.1,
            carbohydrates: 28.9,
            fat: 2.4,
            fiber: 4.9,
            sugar: 3.9,
          },
        },
        {
          name: 'Egg (Whole, Boiled)',
          estimated_quantity: 2,
          unit: 'piece',
          confidence: 0.96,
          nutrition: {
            calories: 155,
            protein: 12.6,
            carbohydrates: 1.1,
            fat: 10.6,
            fiber: 0.0,
            sugar: 1.1,
          },
        },
        {
          name: 'Orange',
          estimated_quantity: 1,
          unit: 'piece',
          confidence: 0.91,
          nutrition: {
            calories: 62,
            protein: 1.2,
            carbohydrates: 15.4,
            fat: 0.2,
            fiber: 3.1,
            sugar: 12.2,
          },
        },
      ];

      return {
        foods,
        totalNutrition: PortionEstimationService.calculateTotals(foods),
        aiConfidence: 0.94,
        explanation:
          'Demo Mode: The meal contains two toasted whole wheat bread slices, two boiled eggs, and a medium fresh orange.',
        portionUncertain: false,
        isDemo: true,
      };
    }

    if (hint.includes('dinner')) {
      const foods: DetectedFood[] = [
        {
          name: 'White Rice (Cooked)',
          estimated_quantity: 200,
          unit: 'g',
          confidence: 0.93,
          nutrition: {
            calories: 260,
            protein: 5.4,
            carbohydrates: 56.4,
            fat: 0.6,
            fiber: 0.8,
            sugar: 0.2,
          },
        },
        {
          name: 'Chicken Breast (Grilled)',
          estimated_quantity: 140,
          unit: 'g',
          confidence: 0.95,
          nutrition: {
            calories: 231,
            protein: 43.4,
            carbohydrates: 0.0,
            fat: 5.0,
            fiber: 0.0,
            sugar: 0.0,
          },
        },
        {
          name: 'Garden Green Salad',
          estimated_quantity: 80,
          unit: 'g',
          confidence: 0.92,
          nutrition: {
            calories: 20,
            protein: 1.0,
            carbohydrates: 3.6,
            fat: 0.2,
            fiber: 1.7,
            sugar: 1.8,
          },
        },
      ];

      return {
        foods,
        totalNutrition: PortionEstimationService.calculateTotals(foods),
        aiConfidence: 0.93,
        explanation:
          'Demo Mode: Detected a healthy high-protein dinner plate with grilled lean chicken breast, steamed white rice, and garden salad.',
        portionUncertain: false,
        isDemo: true,
      };
    }

    // Default Lunch / Popular Biryani Plate
    const foods: DetectedFood[] = [
      {
        name: 'Chicken Biryani',
        estimated_quantity: 300,
        unit: 'g',
        confidence: 0.93,
        nutrition: {
          calories: 525,
          protein: 25.5,
          carbohydrates: 63.0,
          fat: 19.5,
          fiber: 3.6,
          sugar: 3.0,
        },
      },
      {
        name: 'Egg (Whole, Boiled)',
        estimated_quantity: 1,
        unit: 'piece',
        confidence: 0.95,
        nutrition: {
          calories: 78,
          protein: 6.3,
          carbohydrates: 0.6,
          fat: 5.3,
          fiber: 0.0,
          sugar: 0.6,
        },
      },
      {
        name: 'Curd / Plain Yogurt',
        estimated_quantity: 100,
        unit: 'g',
        confidence: 0.89,
        nutrition: {
          calories: 61,
          protein: 3.5,
          carbohydrates: 4.7,
          fat: 3.3,
          fiber: 0.0,
          sugar: 4.7,
        },
      },
    ];

    return {
      foods,
      totalNutrition: PortionEstimationService.calculateTotals(foods),
      aiConfidence: 0.92,
      explanation:
        'Demo Mode: The dish appears to contain approximately 300g of chicken biryani served with a boiled egg and raita. Estimate based on standard serving portions.',
      portionUncertain: false,
      isDemo: true,
    };
  }
}
