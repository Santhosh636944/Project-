import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/database.js';

export class ProfileController {
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const user = db.getUserById(req.user.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const analyses = db.getAnalysesByUser(req.user.userId);
      const totalAnalyses = analyses.length;

      const { password, ...safeUser } = user;
      return res.json({
        profile: safeUser,
        stats: {
          totalAnalyses,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const { name, profileImage, calorieGoal } = req.body;
      const updates: any = {};

      if (name && typeof name === 'string' && name.trim()) {
        updates.name = name.trim();
      }
      if (profileImage && typeof profileImage === 'string') {
        updates.profileImage = profileImage;
      }
      if (calorieGoal && Number(calorieGoal) > 500) {
        updates.calorieGoal = Number(calorieGoal);
      }

      const updated = db.updateUser(req.user.userId, updates);
      if (!updated) return res.status(404).json({ error: 'User not found' });

      const { password, ...safeUser } = updated;
      return res.json({ profile: safeUser, message: 'Profile updated successfully' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Both current and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      const user = db.getUserById(req.user.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      db.updateUser(req.user.userId, { password: hashedPassword });

      return res.json({ message: 'Password updated successfully' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to change password' });
    }
  }
}
