import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { db } from '../db/database.js';

export class HistoryController {
  static async getHistory(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required.' });
      }

      const { mealType, search, page = '1', limit = '10', dateFrom, dateTo } = req.query;

      let analyses = db.getAnalysesByUser(req.user.userId, {
        mealType: mealType ? String(mealType) : undefined,
        search: search ? String(search) : undefined,
      });

      // Filter by date if provided
      if (dateFrom) {
        const fromTime = new Date(String(dateFrom)).getTime();
        analyses = analyses.filter(a => new Date(a.createdAt).getTime() >= fromTime);
      }
      if (dateTo) {
        const toTime = new Date(String(dateTo)).setHours(23, 59, 59, 999);
        analyses = analyses.filter(a => new Date(a.createdAt).getTime() <= toTime);
      }

      const totalItems = analyses.length;
      const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(String(limit), 10) || 10));
      const totalPages = Math.ceil(totalItems / limitNum);

      const startIndex = (pageNum - 1) * limitNum;
      const paginatedAnalyses = analyses.slice(startIndex, startIndex + limitNum);

      return res.json({
        analyses: paginatedAnalyses,
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNum,
          limit: limitNum,
        },
      });
    } catch (err: any) {
      console.error('History error:', err);
      return res.status(500).json({ error: 'Failed to retrieve analysis history.' });
    }
  }

  static async getById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const analysis = db.getAnalysisById(id);
      if (!analysis) {
        return res.status(404).json({ error: 'Analysis record not found.' });
      }

      if (req.user?.role !== 'admin' && analysis.userId !== req.user?.userId) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      return res.json({ analysis });
    } catch (err: any) {
      return res.status(500).json({ error: 'Failed to retrieve item.' });
    }
  }
}
