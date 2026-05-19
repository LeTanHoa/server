import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Verifies JWT from Authorization: Bearer <token> or ?token= for HTML5 audio elements.
 */
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  let token =
    header && header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token && req.query.token) {
    token = String(req.query.token);
  }
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET missing');
    }
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export async function adminMiddleware(req, res, next) {
  try {
    if (!req.user?.sub) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    // Backward-compatible with old tokens that may not include role.
    if (req.user.role === 'admin') {
      return next();
    }
    const user = await User.findById(req.user.sub).select({ role: 1 }).lean();
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.user.role = user.role;
    return next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to verify admin role' });
  }
}
