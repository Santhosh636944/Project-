import bcrypt from 'bcryptjs';
import { FoodItem, User, Analysis } from '../types.js';

// Pre-hashed passwords for faster boot
// admin123 -> $2a$10$wN1X9l7qN7yZ8N6gQ7K9..
// We will generate them safely or check with bcrypt
const adminHash = bcrypt.hashSync('admin123', 10);
const demoHash = bcrypt.hashSync('demo123', 10);

export const SEED_USERS: User[] = [
  {
    _id: 'usr_admin_001',
    name: 'Sarah Connor (Admin)',
    email: 'admin@nutrivision.ai',
    password: adminHash,
    role: 'admin',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    calorieGoal: 2000,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'usr_demo_002',
    name: 'Alex Rivera',
    email: 'demo@nutrivision.ai',
    password: demoHash,
    role: 'user',
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    isActive: true,
    calorieGoal: 2200,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const SEED_FOODS: FoodItem[] = [
  {
    _id: 'food_001',
    name: 'White Rice (Cooked)',
    category: 'Grains',
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.2,
    fatPer100g: 0.3,
    fiberPer100g: 0.4,
    sugarPer100g: 0.1,
    servingUnit: 'cup',
    servingSizeGrams: 160,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_002',
    name: 'Chicken Biryani',
    category: 'Main Dish',
    caloriesPer100g: 175,
    proteinPer100g: 8.5,
    carbsPer100g: 21.0,
    fatPer100g: 6.5,
    fiberPer100g: 1.2,
    sugarPer100g: 1.0,
    servingUnit: 'plate',
    servingSizeGrams: 300,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_003',
    name: 'Vegetable Biryani',
    category: 'Main Dish',
    caloriesPer100g: 145,
    proteinPer100g: 3.5,
    carbsPer100g: 24.0,
    fatPer100g: 4.0,
    fiberPer100g: 2.5,
    sugarPer100g: 1.5,
    servingUnit: 'plate',
    servingSizeGrams: 300,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_004',
    name: 'Chicken Breast (Grilled)',
    category: 'Poultry',
    caloriesPer100g: 165,
    proteinPer100g: 31.0,
    carbsPer100g: 0.0,
    fatPer100g: 3.6,
    fiberPer100g: 0.0,
    sugarPer100g: 0.0,
    servingUnit: 'piece',
    servingSizeGrams: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_005',
    name: 'Egg (Whole, Boiled)',
    category: 'Dairy & Eggs',
    caloriesPer100g: 155,
    proteinPer100g: 12.6,
    carbsPer100g: 1.1,
    fatPer100g: 10.6,
    fiberPer100g: 0.0,
    sugarPer100g: 1.1,
    servingUnit: 'piece',
    servingSizeGrams: 50,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_006',
    name: 'Apple (Fresh)',
    category: 'Fruits',
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 13.8,
    fatPer100g: 0.2,
    fiberPer100g: 2.4,
    sugarPer100g: 10.4,
    servingUnit: 'piece',
    servingSizeGrams: 180,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_007',
    name: 'Banana',
    category: 'Fruits',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 22.8,
    fatPer100g: 0.3,
    fiberPer100g: 2.6,
    sugarPer100g: 12.2,
    servingUnit: 'piece',
    servingSizeGrams: 120,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_008',
    name: 'Orange',
    category: 'Fruits',
    caloriesPer100g: 47,
    proteinPer100g: 0.9,
    carbsPer100g: 11.8,
    fatPer100g: 0.1,
    fiberPer100g: 2.4,
    sugarPer100g: 9.4,
    servingUnit: 'piece',
    servingSizeGrams: 130,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_009',
    name: 'Tomato',
    category: 'Vegetables',
    caloriesPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fatPer100g: 0.2,
    fiberPer100g: 1.2,
    sugarPer100g: 2.6,
    servingUnit: 'piece',
    servingSizeGrams: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_010',
    name: 'Potato (Boiled)',
    category: 'Vegetables',
    caloriesPer100g: 87,
    proteinPer100g: 1.9,
    carbsPer100g: 20.1,
    fatPer100g: 0.1,
    fiberPer100g: 1.8,
    sugarPer100g: 0.8,
    servingUnit: 'piece',
    servingSizeGrams: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_011',
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    caloriesPer100g: 247,
    proteinPer100g: 13.0,
    carbsPer100g: 41.3,
    fatPer100g: 3.4,
    fiberPer100g: 7.0,
    sugarPer100g: 5.6,
    servingUnit: 'slice',
    servingSizeGrams: 35,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_012',
    name: 'Whole Milk',
    category: 'Dairy & Eggs',
    caloriesPer100g: 61,
    proteinPer100g: 3.2,
    carbsPer100g: 4.8,
    fatPer100g: 3.3,
    fiberPer100g: 0.0,
    sugarPer100g: 5.1,
    servingUnit: 'cup (ml)',
    servingSizeGrams: 240,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_013',
    name: 'Curd / Plain Yogurt',
    category: 'Dairy & Eggs',
    caloriesPer100g: 61,
    proteinPer100g: 3.5,
    carbsPer100g: 4.7,
    fatPer100g: 3.3,
    fiberPer100g: 0.0,
    sugarPer100g: 4.7,
    servingUnit: 'cup',
    servingSizeGrams: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_014',
    name: 'Idli (Steamed)',
    category: 'South Indian',
    caloriesPer100g: 140,
    proteinPer100g: 4.5,
    carbsPer100g: 28.0,
    fatPer100g: 0.4,
    fiberPer100g: 1.5,
    sugarPer100g: 0.5,
    servingUnit: 'piece',
    servingSizeGrams: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_015',
    name: 'Plain Dosa',
    category: 'South Indian',
    caloriesPer100g: 168,
    proteinPer100g: 3.9,
    carbsPer100g: 29.0,
    fatPer100g: 3.7,
    fiberPer100g: 1.2,
    sugarPer100g: 0.8,
    servingUnit: 'piece',
    servingSizeGrams: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_016',
    name: 'Masala Dosa',
    category: 'South Indian',
    caloriesPer100g: 205,
    proteinPer100g: 4.5,
    carbsPer100g: 32.0,
    fatPer100g: 6.8,
    fiberPer100g: 2.4,
    sugarPer100g: 1.2,
    servingUnit: 'piece',
    servingSizeGrams: 160,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_017',
    name: 'Sambar',
    category: 'South Indian',
    caloriesPer100g: 65,
    proteinPer100g: 2.8,
    carbsPer100g: 10.0,
    fatPer100g: 1.5,
    fiberPer100g: 2.5,
    sugarPer100g: 1.8,
    servingUnit: 'bowl',
    servingSizeGrams: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_018',
    name: 'Chapati / Roti',
    category: 'Breads',
    caloriesPer100g: 264,
    proteinPer100g: 9.1,
    carbsPer100g: 48.0,
    fatPer100g: 4.2,
    fiberPer100g: 6.0,
    sugarPer100g: 1.5,
    servingUnit: 'piece',
    servingSizeGrams: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_019',
    name: 'Parotta / Paratha',
    category: 'Breads',
    caloriesPer100g: 320,
    proteinPer100g: 6.5,
    carbsPer100g: 45.0,
    fatPer100g: 12.0,
    fiberPer100g: 3.0,
    sugarPer100g: 2.0,
    servingUnit: 'piece',
    servingSizeGrams: 80,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_020',
    name: 'Fried Rice',
    category: 'Asian',
    caloriesPer100g: 163,
    proteinPer100g: 3.8,
    carbsPer100g: 27.0,
    fatPer100g: 4.2,
    fiberPer100g: 1.4,
    sugarPer100g: 1.0,
    servingUnit: 'cup',
    servingSizeGrams: 160,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_021',
    name: 'Vegetable Noodles',
    category: 'Asian',
    caloriesPer100g: 138,
    proteinPer100g: 3.2,
    carbsPer100g: 25.0,
    fatPer100g: 2.8,
    fiberPer100g: 1.8,
    sugarPer100g: 1.5,
    servingUnit: 'cup',
    servingSizeGrams: 160,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_022',
    name: 'Paneer (Cottage Cheese)',
    category: 'Dairy & Eggs',
    caloriesPer100g: 265,
    proteinPer100g: 18.3,
    carbsPer100g: 3.4,
    fatPer100g: 20.8,
    fiberPer100g: 0.0,
    sugarPer100g: 2.6,
    servingUnit: 'serving',
    servingSizeGrams: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_023',
    name: 'Salmon / Grilled Fish',
    category: 'Seafood',
    caloriesPer100g: 206,
    proteinPer100g: 22.1,
    carbsPer100g: 0.0,
    fatPer100g: 12.3,
    fiberPer100g: 0.0,
    sugarPer100g: 0.0,
    servingUnit: 'fillet',
    servingSizeGrams: 150,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_024',
    name: 'Yellow Dal / Lentil Soup',
    category: 'Legumes',
    caloriesPer100g: 116,
    proteinPer100g: 9.0,
    carbsPer100g: 20.1,
    fatPer100g: 0.4,
    fiberPer100g: 7.9,
    sugarPer100g: 1.8,
    servingUnit: 'bowl',
    servingSizeGrams: 180,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'food_025',
    name: 'Garden Green Salad',
    category: 'Salads',
    caloriesPer100g: 25,
    proteinPer100g: 1.2,
    carbsPer100g: 4.5,
    fatPer100g: 0.3,
    fiberPer100g: 2.1,
    sugarPer100g: 2.3,
    servingUnit: 'bowl',
    servingSizeGrams: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Realistic analyses for Demo / Initial User state
export const SEED_ANALYSES: Analysis[] = [
  {
    _id: 'anl_demo_001',
    userId: 'usr_demo_002',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    mealType: 'Lunch',
    foods: [
      {
        name: 'Chicken Biryani',
        estimated_quantity: 300,
        unit: 'g',
        confidence: 0.94,
        nutrition: {
          calories: 525,
          protein: 25.5,
          carbohydrates: 63.0,
          fat: 19.5,
          fiber: 3.6,
          sugar: 3.0
        }
      },
      {
        name: 'Curd / Plain Yogurt',
        estimated_quantity: 80,
        unit: 'g',
        confidence: 0.88,
        nutrition: {
          calories: 49,
          protein: 2.8,
          carbohydrates: 3.8,
          fat: 2.6,
          fiber: 0.0,
          sugar: 3.8
        }
      }
    ],
    totalNutrition: {
      calories: 574,
      protein: 28.3,
      carbohydrates: 66.8,
      fat: 22.1,
      fiber: 3.6,
      sugar: 6.8
    },
    aiConfidence: 0.92,
    explanation: 'The image shows aromatic spiced chicken biryani with long-grain basmati rice and raita. Portion estimated at ~300g biryani and ~80g curd raita.',
    portionUncertain: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'anl_demo_002',
    userId: 'usr_demo_002',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    mealType: 'Dinner',
    foods: [
      {
        name: 'White Rice (Cooked)',
        estimated_quantity: 200,
        unit: 'g',
        confidence: 0.92,
        nutrition: {
          calories: 260,
          protein: 5.4,
          carbohydrates: 56.4,
          fat: 0.6,
          fiber: 0.8,
          sugar: 0.2
        }
      },
      {
        name: 'Chicken Breast (Grilled)',
        estimated_quantity: 120,
        unit: 'g',
        confidence: 0.95,
        nutrition: {
          calories: 198,
          protein: 37.2,
          carbohydrates: 0.0,
          fat: 4.3,
          fiber: 0.0,
          sugar: 0.0
        }
      },
      {
        name: 'Egg (Whole, Boiled)',
        estimated_quantity: 1,
        unit: 'piece',
        confidence: 0.96,
        nutrition: {
          calories: 78,
          protein: 6.3,
          carbohydrates: 0.6,
          fat: 5.3,
          fiber: 0.0,
          sugar: 0.6
        }
      },
      {
        name: 'Garden Green Salad',
        estimated_quantity: 80,
        unit: 'g',
        confidence: 0.90,
        nutrition: {
          calories: 20,
          protein: 1.0,
          carbohydrates: 3.6,
          fat: 0.2,
          fiber: 1.7,
          sugar: 1.8
        }
      }
    ],
    totalNutrition: {
      calories: 556,
      protein: 49.9,
      carbohydrates: 60.6,
      fat: 10.4,
      fiber: 2.5,
      sugar: 2.6
    },
    aiConfidence: 0.94,
    explanation: 'A balanced plate containing steamed white rice, grilled seasoned chicken breast strips, one boiled egg, and a fresh green vegetable salad.',
    portionUncertain: false,
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'anl_demo_003',
    userId: 'usr_demo_002',
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
    mealType: 'Breakfast',
    foods: [
      {
        name: 'Masala Dosa',
        estimated_quantity: 1,
        unit: 'piece',
        confidence: 0.95,
        nutrition: {
          calories: 328,
          protein: 7.2,
          carbohydrates: 51.2,
          fat: 10.9,
          fiber: 3.8,
          sugar: 1.9
        }
      },
      {
        name: 'Sambar',
        estimated_quantity: 120,
        unit: 'g',
        confidence: 0.89,
        nutrition: {
          calories: 78,
          protein: 3.4,
          carbohydrates: 12.0,
          fat: 1.8,
          fiber: 3.0,
          sugar: 2.2
        }
      }
    ],
    totalNutrition: {
      calories: 406,
      protein: 10.6,
      carbohydrates: 63.2,
      fat: 12.7,
      fiber: 6.8,
      sugar: 4.1
    },
    aiConfidence: 0.92,
    explanation: 'Crispy South Indian fermented crepe with spiced potato filling served with vegetable lentil sambar.',
    portionUncertain: false,
    createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'anl_demo_004',
    userId: 'usr_demo_002',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    mealType: 'Breakfast',
    foods: [
      {
        name: 'Whole Wheat Bread',
        estimated_quantity: 2,
        unit: 'slice',
        confidence: 0.93,
        nutrition: {
          calories: 173,
          protein: 9.1,
          carbohydrates: 28.9,
          fat: 2.4,
          fiber: 4.9,
          sugar: 3.9
        }
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
          sugar: 1.1
        }
      }
    ],
    totalNutrition: {
      calories: 328,
      protein: 21.7,
      carbohydrates: 30.0,
      fat: 13.0,
      fiber: 4.9,
      sugar: 5.0
    },
    aiConfidence: 0.94,
    explanation: 'Breakfast featuring two slices of toasted whole wheat bread accompanied by two soft boiled eggs.',
    portionUncertain: false,
    createdAt: new Date(Date.now() - 74 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 74 * 60 * 60 * 1000).toISOString()
  }
];
