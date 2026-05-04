import { Router } from 'express';
import { getOverview, listPlaylists, listUsers } from '../controllers/adminController.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';

export const adminRouter = Router();

adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get('/overview', getOverview);
adminRouter.get('/users', listUsers);
adminRouter.get('/playlists', listPlaylists);
