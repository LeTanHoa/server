import { User } from '../models/User.js';
import { Song } from '../models/Song.js';
import { Playlist } from '../models/Playlist.js';
import { Favorite } from '../models/Favorite.js';
import { History } from '../models/History.js';

export async function getOverview(_req, res) {
  try {
    const [users, songs, playlists, favorites, historyEntries] = await Promise.all([
      User.countDocuments(),
      Song.countDocuments(),
      Playlist.countDocuments(),
      Favorite.countDocuments(),
      History.countDocuments(),
    ]);

    return res.json({
      overview: {
        users,
        songs,
        playlists,
        favorites,
        historyEntries,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load admin overview' });
  }
}

export async function listUsers(_req, res) {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select({ passwordHash: 0 })
      .limit(300)
      .lean();
    return res.json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load users' });
  }
}

export async function listPlaylists(_req, res) {
  try {
    const playlists = await Playlist.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'email username')
      .limit(300)
      .lean();

    return res.json({
      playlists: playlists.map((p) => ({
        id: p._id,
        name: p.name,
        createdAt: p.createdAt,
        songCount: (p.songs || []).length,
        user: p.userId
          ? {
              id: p.userId._id,
              email: p.userId.email,
              username: p.userId.username,
            }
          : null,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load playlists' });
  }
}
