import { Router } from 'express';
import {
  listSongs,
  getSong,
  createSongFromLink,
  createSongFromUpload,
  audioUpload,
  updateSong,
  deleteSong,
} from '../controllers/songController.js';
import { adminMiddleware, authMiddleware } from '../middleware/auth.js';

export const songsRouter = Router();

songsRouter.post('/from-link', authMiddleware, adminMiddleware, createSongFromLink);
// songsRouter.post(
//   '/upload',
//   authMiddleware,
//   adminMiddleware,
//   (req, res, next) => {
//     audioUpload.single('audio')(req, res, (err) => {
//       if (err instanceof multer.MulterError) {
//         return res.status(413).json({ error: 'File quá lớn (tối đa 50MB)' });
//       }
//       if (err) {
//         return res.status(400).json({ error: err.message });
//       }
//       next();
//     });
//   },
//   createSongFromUpload
// );

songsRouter.post(
  '/upload',
  authMiddleware,
  adminMiddleware,
  createSongFromUpload
);

songsRouter.get('/', listSongs);
songsRouter.get('/:id', getSong);
songsRouter.put('/:id', authMiddleware, adminMiddleware, updateSong);
songsRouter.delete('/:id', authMiddleware, adminMiddleware, deleteSong);
