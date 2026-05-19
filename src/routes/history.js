import { Router } from 'express';
import { recent, recommend, top, recordPlay } from '../controllers/historyController.js';
import { authMiddleware } from '../middleware/auth.js';

export const historyRouter = Router();

historyRouter.get('/top', top);
historyRouter.use(authMiddleware);
historyRouter.get('/recent', recent);
historyRouter.get('/recommend', recommend);
historyRouter.post('/play', recordPlay);
