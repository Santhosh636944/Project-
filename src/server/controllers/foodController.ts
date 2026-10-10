import { Request, Response } from 'express';
import { db } from '../db/database.js';

export class FoodController {
  static async getFoods(req: Request, res: Response) {
    try {
      const { search, category } = req.query;
      const foods = db.searchFoods(search ? String(search) : undefined, category ? String(category) : undefined);
      return res.json({ foods });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve food items' });
    }
  }

  static async getFoodById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const food = db.getFoodById(id);
      if (!food) {
        return res.status(404).json({ error: 'Food item not found' });
      }
      return res.json({ food });
    } catch (err: any) {
      return res.status(500).json({ error: 'Error fetching food item' });
    }
  }
}
