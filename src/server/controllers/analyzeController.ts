import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/database.js';
import { FoodRecognitionService } from '../services/FoodRecognitionService.js';
import { PortionEstimationService } from '../services/PortionEstimationService.js';
import { ImageStorageService } from '../services/ImageStorageService.js';
import { MealType, DetectedFood } from '../types.js';

export class AnalyzeController {
  static async analyze(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Please log in to analyze food.' });
      }

      let base64Data = '';
      let mimeType = 'image/jpeg';
      let imageUrl = '';

      // Check if file was uploaded via multer or sent as base64 in body
      if (req.file) {
        if (req.file.size > 10 * 1024 * 1024) {
          return res.status(400).json({ error: 'Image exceeds maximum 10MB limit.' });
        }
        mimeType = req.file.mimetype;
        base64Data = req.file.buffer.toString('base64');
        imageUrl = await ImageStorageService.saveFile(req.file.buffer, req.file.originalname, mimeType);
      } else if (req.body.imageBase64) {
        let raw = req.body.imageBase64 as string;
        mimeType = req.body.mimeType || 'image/jpeg';

        if (raw.startsWith('data:')) {
          const match = raw.match(/^data:(image\/\w+);base64,/);
          if (match) {
            mimeType = match[1];
          }
          raw = raw.replace(/^data:image\/\w+;base64,/, '');
        }

        // Approximate size check
        const approxBytes = (raw.length * 3) / 4;
        if (approxBytes > 10 * 1024 * 1024) {
          return res.status(400).json({ error: 'Image exceeds maximum 10MB limit.' });
        }

        base64Data = raw;
        imageUrl = await ImageStorageService.saveBase64(base64Data, mimeType);
      } else if (req.body.sampleImageUrl) {
        // Sample image provided in demo
        imageUrl = req.body.sampleImageUrl;
        base64Data = ''; // will trigger demo or recognition
      } else {
        return res.status(400).json({ error: 'No image provided. Please upload a food photo.' });
      }

      const mealType: MealType = (req.body.mealType as MealType) || 'Lunch';
      const isDemo = Boolean(req.body.isDemo);

      // Perform AI Food Recognition
      const recognition = await FoodRecognitionService.analyzeImage(base64Data, mimeType, {
        isDemo: isDemo || !base64Data,
        mealHint: mealType,
      });

      // Save to Database
      const newAnalysis = db.createAnalysis({
        userId: req.user.userId,
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
        mealType,
        foods: recognition.foods,
        totalNutrition: recognition.totalNutrition,
        aiConfidence: recognition.aiConfidence,
        explanation: recognition.explanation,
        portionUncertain: recognition.portionUncertain,
        isDemo: recognition.isDemo,
      });

      return res.status(201).json({
        analysis: newAnalysis,
        message: 'Food analysis completed successfully.',
      });
    } catch (err: any) {
      console.error('Food analysis error:', err);
      return res.status(500).json({
        error: err.message || "We couldn't confidently identify the food in this image. Try uploading a clearer image with the food visible.",
      });
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const analysis = db.getAnalysisById(id);

      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found.' });
      }

      // Check access permission (owner or admin)
      if (req.user?.role !== 'admin' && analysis.userId !== req.user?.userId) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      return res.json({ analysis });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve analysis.' });
    }
  }

  static async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const analysis = db.getAnalysisById(id);

      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found.' });
      }

      if (req.user?.role !== 'admin' && analysis.userId !== req.user?.userId) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      const { foods, mealType, notes } = req.body;

      let updatedFoods: DetectedFood[] = analysis.foods;

      if (foods && Array.isArray(foods)) {
        // Recalculate nutrition for each food item that may have been edited
        updatedFoods = foods.map((f: DetectedFood) => {
          const recalculatedNutrition = PortionEstimationService.recalculateItemNutrition(
            f.name,
            Number(f.estimated_quantity) || 100,
            f.unit || 'g',
            f.nutrition,
            f.estimated_quantity
          );
          return {
            ...f,
            estimated_quantity: Number(f.estimated_quantity),
            nutrition: recalculatedNutrition,
          };
        });
      }

      const updatedTotals = PortionEstimationService.calculateTotals(updatedFoods);

      const updated = db.updateAnalysis(id, {
        foods: updatedFoods,
        totalNutrition: updatedTotals,
        mealType: mealType || analysis.mealType,
        notes: notes !== undefined ? notes : analysis.notes,
        portionUncertain: false, // User confirmed manually
      });

      return res.json({
        analysis: updated,
        message: 'Analysis successfully updated with recalculations.',
      });
    } catch (err: any) {
      console.error('Update analysis error:', err);
      return res.status(500).json({ error: 'Failed to update analysis.' });
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const analysis = db.getAnalysisById(id);

      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found.' });
      }

      if (req.user?.role !== 'admin' && analysis.userId !== req.user?.userId) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      const success = db.deleteAnalysis(id);
      if (success) {
        return res.json({ message: 'Analysis deleted successfully.' });
      }
      return res.status(500).json({ error: 'Failed to delete analysis.' });
    } catch (err: any) {
      return res.status(500).json({ error: 'Error deleting analysis.' });
    }
  }
}
