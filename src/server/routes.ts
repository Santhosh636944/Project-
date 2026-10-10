import { Router } from 'express';
import multer from 'multer';
import { AuthController } from './controllers/authController.js';
import { AnalyzeController } from './controllers/analyzeController.js';
import { HistoryController } from './controllers/historyController.js';
import { AnalyticsController } from './controllers/analyticsController.js';
import { ProfileController } from './controllers/profileController.js';
import { AdminController } from './controllers/adminController.js';
import { FoodController } from './controllers/foodController.js';
import { authenticate, requireAdmin } from './middleware/auth.js';

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  storage: multer.memoryStorage(),
});

export const apiRouter = Router();

// --- Auth Routes ---
apiRouter.post('/auth/register', AuthController.register);
apiRouter.post('/auth/login', AuthController.login);
apiRouter.get('/auth/me', authenticate as any, AuthController.getMe as any);

// --- Analyze Routes ---
apiRouter.post('/analyze', authenticate as any, upload.single('image'), AnalyzeController.analyze as any);
apiRouter.get('/analyze/:id', authenticate as any, AnalyzeController.getById as any);
apiRouter.put('/analyze/:id', authenticate as any, AnalyzeController.update as any);
apiRouter.delete('/analyze/:id', authenticate as any, AnalyzeController.delete as any);

// --- History Routes ---
apiRouter.get('/history', authenticate as any, HistoryController.getHistory as any);
apiRouter.get('/history/:id', authenticate as any, HistoryController.getById as any);

// --- Analytics Routes ---
apiRouter.get('/analytics', authenticate as any, AnalyticsController.getAnalytics as any);
apiRouter.get('/analytics/daily', authenticate as any, AnalyticsController.getAnalytics as any);
apiRouter.get('/analytics/weekly', authenticate as any, AnalyticsController.getAnalytics as any);
apiRouter.get('/analytics/monthly', authenticate as any, AnalyticsController.getAnalytics as any);

// --- Profile Routes ---
apiRouter.get('/profile', authenticate as any, ProfileController.getProfile as any);
apiRouter.put('/profile', authenticate as any, ProfileController.updateProfile as any);
apiRouter.put('/profile/password', authenticate as any, ProfileController.changePassword as any);

// --- Food Database (Search & Autocomplete) ---
apiRouter.get('/foods', FoodController.getFoods);
apiRouter.get('/foods/:id', FoodController.getFoodById);

// --- Admin Routes ---
apiRouter.get('/admin/users', authenticate as any, requireAdmin as any, AdminController.getUsers as any);
apiRouter.put('/admin/users/:id/toggle', authenticate as any, requireAdmin as any, AdminController.toggleUserStatus as any);
apiRouter.delete('/admin/users/:id', authenticate as any, requireAdmin as any, AdminController.deleteUser as any);

apiRouter.get('/admin/foods', authenticate as any, requireAdmin as any, FoodController.getFoods as any);
apiRouter.post('/admin/foods', authenticate as any, requireAdmin as any, AdminController.createFood as any);
apiRouter.put('/admin/foods/:id', authenticate as any, requireAdmin as any, AdminController.updateFood as any);
apiRouter.delete('/admin/foods/:id', authenticate as any, requireAdmin as any, AdminController.deleteFood as any);

apiRouter.get('/admin/stats', authenticate as any, requireAdmin as any, AdminController.getAdminStats as any);
