import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/database.js';

export class AdminController {
  // Users Management
  static async getUsers(req: AuthenticatedRequest, res: Response) {
    try {
      const { search } = req.query;
      const users = db.listUsers(search ? String(search) : undefined);
      const safeUsers = users.map(({ password, ...u }) => u);
      return res.json({ users: safeUsers });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve users' });
    }
  }

  static async toggleUserStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const user = db.getUserById(id);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (user.role === 'admin' && user._id === req.user?.userId) {
        return res.status(400).json({ error: 'Cannot deactivate your own administrator account' });
      }

      const updated = db.updateUser(id, { isActive: !user.isActive });
      const { password, ...safeUser } = updated!;
      return res.json({ user: safeUser, message: `User status changed to ${safeUser.isActive ? 'Active' : 'Disabled'}` });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to toggle user status' });
    }
  }

  static async deleteUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      if (id === req.user?.userId) {
        return res.status(400).json({ error: 'Cannot delete your own administrator account' });
      }

      const success = db.deleteUser(id);
      if (success) {
        return res.json({ message: 'User and associated analyses deleted successfully' });
      }
      return res.status(404).json({ error: 'User not found' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to delete user' });
    }
  }

  // Food Database Management
  static async createFood(req: AuthenticatedRequest, res: Response) {
    try {
      const {
        name,
        category,
        caloriesPer100g,
        proteinPer100g,
        carbsPer100g,
        fatPer100g,
        fiberPer100g,
        sugarPer100g,
        servingUnit,
        servingSizeGrams,
      } = req.body;

      if (!name || caloriesPer100g === undefined) {
        return res.status(400).json({ error: 'Food name and calories per 100g are required' });
      }

      const newFood = db.createFood({
        name: name.trim(),
        category: category?.trim() || 'General',
        caloriesPer100g: Number(caloriesPer100g) || 0,
        proteinPer100g: Number(proteinPer100g) || 0,
        carbsPer100g: Number(carbsPer100g) || 0,
        fatPer100g: Number(fatPer100g) || 0,
        fiberPer100g: Number(fiberPer100g) || 0,
        sugarPer100g: Number(sugarPer100g) || 0,
        servingUnit: servingUnit?.trim() || 'serving',
        servingSizeGrams: Number(servingSizeGrams) || 100,
      });

      return res.status(201).json({ food: newFood, message: 'Food item successfully created' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to create food item' });
    }
  }

  static async updateFood(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updated = db.updateFood(id, {
        ...updates,
        caloriesPer100g: updates.caloriesPer100g !== undefined ? Number(updates.caloriesPer100g) : undefined,
        proteinPer100g: updates.proteinPer100g !== undefined ? Number(updates.proteinPer100g) : undefined,
        carbsPer100g: updates.carbsPer100g !== undefined ? Number(updates.carbsPer100g) : undefined,
        fatPer100g: updates.fatPer100g !== undefined ? Number(updates.fatPer100g) : undefined,
        fiberPer100g: updates.fiberPer100g !== undefined ? Number(updates.fiberPer100g) : undefined,
        sugarPer100g: updates.sugarPer100g !== undefined ? Number(updates.sugarPer100g) : undefined,
      });

      if (!updated) return res.status(404).json({ error: 'Food item not found' });
      return res.json({ food: updated, message: 'Food item updated successfully' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update food item' });
    }
  }

  static async deleteFood(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const success = db.deleteFood(id);
      if (success) {
        return res.json({ message: 'Food item deleted successfully' });
      }
      return res.status(404).json({ error: 'Food item not found' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to delete food item' });
    }
  }

  // System Stats
  static async getAdminStats(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = db.getStats();
      return res.json({ stats });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to compute admin statistics' });
    }
  }
}
