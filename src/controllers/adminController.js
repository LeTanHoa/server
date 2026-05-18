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

export async function updateUser(req, res) {
  try {
    const { username, email, role } = req.body || {};
    const payload = {};

    if (username !== undefined) {
      payload.username = String(username).trim();
      if (!payload.username) {
        return res.status(400).json({ error: 'username is required' });
      }
    }

    if (email !== undefined) {
      payload.email = String(email).trim().toLowerCase();
      if (!payload.email) {
        return res.status(400).json({ error: 'email is required' });
      }
      const existing = await User.findOne({ email: payload.email, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(409).json({ error: 'Email already registered' });
      }
    }

    if (role !== undefined) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'role must be user or admin' });
      }
      payload.role = role;
    }

    const user = await User.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    })
      .select({ passwordHash: 0 })
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update user' });
  }
}

export async function deleteUser(req, res) {
  try {
    if (String(req.user.sub) === String(req.params.id)) {
      return res.status(400).json({ error: 'Cannot delete current admin user' });
    }

    const user = await User.findByIdAndDelete(req.params.id).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await Promise.all([
      Playlist.deleteMany({ userId: req.params.id }),
      Favorite.deleteMany({ userId: req.params.id }),
      History.deleteMany({ userId: req.params.id }),
    ]);

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to delete user' });
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
