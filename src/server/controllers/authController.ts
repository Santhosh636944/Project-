import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { generateToken, AuthenticatedRequest } from '../middleware/auth.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, confirmPassword } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields (Name, Email, Password) are required.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }

      if (confirmPassword && password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match.' });
      }

      const existingUser = db.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = db.createUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: 'user',
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        isActive: true,
        calorieGoal: 2000,
      });

      const token = generateToken({
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      });

      const { password: _, ...userWithoutPassword } = newUser;
      return res.status(201).json({
        user: userWithoutPassword,
        token,
        message: 'Account successfully registered.',
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      return res.status(500).json({ error: 'Failed to register account. Please try again.' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
      }

      const user = db.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      if (!user.isActive) {
        return res.status(403).json({ error: 'This account has been disabled by an administrator.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const token = generateToken({
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      const { password: _, ...userWithoutPassword } = user;
      return res.json({
        user: userWithoutPassword,
        token,
        message: 'Login successful.',
      });
    } catch (err: any) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Failed to log in. Please try again.' });
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated.' });
      }

      const user = db.getUserById(req.user.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      const { password: _, ...userWithoutPassword } = user;
      return res.json({ user: userWithoutPassword });
    } catch (err: any) {
      return res.status(500).json({ error: 'Server error retrieving user session.' });
    }
  }
}
