import { verifyToken } from '../auth/token.js';

// Requires a valid "Authorization: Bearer <token>" header and sets req.user.
export function requireAuth(req, res, next) {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const claims = verifyToken(token);
  if (!claims) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = { id: claims.sub, username: claims.username };
  next();
}
