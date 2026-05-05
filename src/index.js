import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDb } from './config/db.js';
import { authRouter } from './routes/auth.js';
import { songsRouter } from './routes/songs.js';
import { playlistsRouter } from './routes/playlists.js';
import { streamRouter } from './routes/stream.js';
import { historyRouter } from './routes/history.js';
import { favoritesRouter } from './routes/favorites.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "https://musicut.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// POST /register, POST /login
app.use('/api/', authRouter);

app.use('/api/songs', songsRouter);
app.use('/api/playlist', playlistsRouter);
app.use('/api/stream', streamRouter);
app.use('/api/history', historyRouter);
app.use('/api/favorites', favoritesRouter);

app.use('/intro',(req,res)=>{
  res.status(404).send("Hello World");
});

async function main() {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
