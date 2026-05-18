import { Router } from 'express';
import {
  deleteUser,
  getOverview,
  listPlaylists,
  listUsers,
  updateUser,
} from '../controllers/adminController.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';

export const adminRouter = Router();

adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get('/overview', getOverview);
adminRouter.get('/users', listUsers);
adminRouter.put('/users/:id', updateUser);
adminRouter.delete('/users/:id', deleteUser);
adminRouter.get('/playlists', listPlaylists);
