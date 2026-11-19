import { Buffer } from 'node:buffer';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function resolveSecret() {
  if (process.env.AUTH_SECRET) {
    return process.env.AUTH_SECRET;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('AUTH_SECRET must be set in production');
  }
  if (process.env.NODE_ENV !== 'test') {
    console.warn('⚠️  AUTH_SECRET is not set; using a random secret. Logins will not survive a restart.');
  }
  return randomBytes(32).toString('hex');
}

const SECRET = resolveSecret();

const base64url = (value) => Buffer.from(value).toString('base64url');

function sign(data) {
  return createHmac('sha256', SECRET).update(data).digest('base64url');
}

// Creates a signed JWT (HS256) for the given user.
export function createToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    sub: user.id,
    username: user.username,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS
  }));
  return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
}

// Returns the token payload, or null if the token is invalid or expired.
export function verifyToken(token) {
  const parts = String(token).split('.');
  if (parts.length !== 3) {
    return null;
  }
  const [header, payload, signature] = parts;

  const expected = Buffer.from(sign(`${header}.${payload}`));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  try {
    const { alg } = JSON.parse(Buffer.from(header, 'base64url').toString());
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (alg !== 'HS256' || typeof claims.exp !== 'number') {
      return null;
    }
    if (claims.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return claims;
  } catch {
    return null;
  }
}
