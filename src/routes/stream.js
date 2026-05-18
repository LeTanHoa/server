import { Router } from 'express';
import { streamSong, coverSong, streamMeta } from '../controllers/streamController.js';

export const streamRouter = Router();

streamRouter.get('/meta/:songId', streamMeta);
streamRouter.get('/cover/:songId', coverSong);
streamRouter.get('/:songId', streamSong);
