import fs from 'fs';
import path from 'path';
import { User, FoodItem, Analysis } from '../types.js';
import { SEED_USERS, SEED_FOODS, SEED_ANALYSES } from './seedData.js';

interface DatabaseData {
  users: User[];
  foodItems: FoodItem[];
  analyses: Analysis[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'nutrivision_db.json');

class DatabaseStore {
  private data: DatabaseData = {
    users: [],
    foodItems: [],
    analyses: []
  };
  private isLoaded = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        this.data = {
          users: parsed.users || [],
          foodItems: parsed.foodItems || [],
          analyses: parsed.analyses || []
        };
      } else {
        // Seed default dataset
        this.data = {
          users: [...SEED_USERS],
          foodItems: [...SEED_FOODS],
          analyses: [...SEED_ANALYSES]
        };
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.error('Failed to init persistent database store:', err);
      // Fallback in-memory seed
      this.data = {
        users: [...SEED_USERS],
        foodItems: [...SEED_FOODS],
        analyses: [...SEED_ANALYSES]
      };
      this.isLoaded = true;
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to database file:', err);
    }
  }

  // --- Users ---
  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u._id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      ...user,
      _id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.data.users.findIndex(u => u._id === id);
    if (index === -1) return null;
    this.data.users[index] = {
      ...this.data.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.users[index];
  }

  deleteUser(id: string): boolean {
    const initialLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u._id !== id);
    // Also remove their analyses
    this.data.analyses = this.data.analyses.filter(a => a.userId !== id);
    if (this.data.users.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  listUsers(search?: string): User[] {
    let list = [...this.data.users];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list;
  }

  // --- Food Items ---
  getFoodById(id: string): FoodItem | undefined {
    return this.data.foodItems.find(f => f._id === id);
  }

  findFoodByName(name: string): FoodItem | undefined {
    const q = name.toLowerCase().trim();
    return this.data.foodItems.find(f => f.name.toLowerCase().includes(q) || q.includes(f.name.toLowerCase()));
  }

  searchFoods(query?: string, category?: string): FoodItem[] {
    let list = [...this.data.foodItems];
    if (category && category !== 'All') {
      list = list.filter(f => f.category.toLowerCase() === category.toLowerCase());
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(f => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
    }
    return list;
  }

  createFood(food: Omit<FoodItem, '_id' | 'createdAt' | 'updatedAt'>): FoodItem {
    const newFood: FoodItem = {
      ...food,
      _id: 'food_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.foodItems.push(newFood);
    this.save();
    return newFood;
  }

  updateFood(id: string, updates: Partial<FoodItem>): FoodItem | null {
    const index = this.data.foodItems.findIndex(f => f._id === id);
    if (index === -1) return null;
    this.data.foodItems[index] = {
      ...this.data.foodItems[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.foodItems[index];
  }

  deleteFood(id: string): boolean {
    const initialLen = this.data.foodItems.length;
    this.data.foodItems = this.data.foodItems.filter(f => f._id !== id);
    if (this.data.foodItems.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Analyses ---
  getAnalysisById(id: string): Analysis | undefined {
    return this.data.analyses.find(a => a._id === id);
  }

  getAnalysesByUser(userId: string, options?: { limit?: number; mealType?: string; search?: string }): Analysis[] {
    let list = this.data.analyses.filter(a => a.userId === userId);
    if (options?.mealType && options.mealType !== 'All') {
      list = list.filter(a => a.mealType === options.mealType);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      list = list.filter(a =>
        a.foods.some(f => f.name.toLowerCase().includes(q)) ||
        a.mealType.toLowerCase().includes(q)
      );
    }
    // Sort descending by date
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (options?.limit) {
      list = list.slice(0, options.limit);
    }
    return list;
  }

  createAnalysis(analysis: Omit<Analysis, '_id' | 'createdAt' | 'updatedAt'>): Analysis {
    const newAnalysis: Analysis = {
      ...analysis,
      _id: 'anl_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.analyses.unshift(newAnalysis);
    this.save();
    return newAnalysis;
  }

  updateAnalysis(id: string, updates: Partial<Analysis>): Analysis | null {
    const index = this.data.analyses.findIndex(a => a._id === id);
    if (index === -1) return null;
    this.data.analyses[index] = {
      ...this.data.analyses[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.save();
    return this.data.analyses[index];
  }

  deleteAnalysis(id: string, userId?: string): boolean {
    const initialLen = this.data.analyses.length;
    this.data.analyses = this.data.analyses.filter(a => {
      if (a._id !== id) return true;
      if (userId && a.userId !== userId) return true; // not owner
      return false;
    });
    if (this.data.analyses.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  getAllAnalyses(): Analysis[] {
    return [...this.data.analyses].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // --- Statistics helper for admin & analytics ---
  getStats() {
    const totalUsers = this.data.users.length;
    const totalAnalyses = this.data.analyses.length;
    const totalFoodsInDb = this.data.foodItems.length;

    // Calculate food frequencies
    const foodFrequency: Record<string, { count: number; calories: number }> = {};
    let totalCaloriesSum = 0;

    for (const a of this.data.analyses) {
      totalCaloriesSum += a.totalNutrition.calories || 0;
      for (const f of a.foods) {
        if (!foodFrequency[f.name]) {
          foodFrequency[f.name] = { count: 0, calories: 0 };
        }
        foodFrequency[f.name].count += 1;
        foodFrequency[f.name].calories += f.nutrition.calories || 0;
      }
    }

    const mostAnalyzedFoods = Object.entries(foodFrequency)
      .map(([name, data]) => ({ name, count: data.count, calories: data.calories }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const avgCalories = totalAnalyses > 0 ? Math.round(totalCaloriesSum / totalAnalyses) : 0;

    return {
      totalUsers,
      totalAnalyses,
      totalFoodsInDb,
      avgCalories,
      mostAnalyzedFoods
    };
  }
}

export const db = new DatabaseStore();
