import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseRemote } from './supabase-remote';

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET || process.env.SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    console.error('CRITICAL: JWT_SECRET or SESSION_SECRET must be set in production. Auth operations will be rejected.');
    return '';
  }
  return 'usdrop-dev-secret-key-change-in-production';
}

const JWT_SECRET = resolveJwtSecret();

export interface AuthUser {
  id: string;
  email: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  account_type: string;
  internal_role: string | null;
  status: string;
  onboarding_completed: boolean;
  subscription_plan_id: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      accessToken?: string;
    }
  }
}

const AUTH_CACHE_TTL = 30_000;
const authCache = new Map<string, { user: AuthUser; expires: number }>();

function getCachedUser(userId: string): AuthUser | null {
  const entry = authCache.get(userId);
  if (entry && Date.now() < entry.expires) return entry.user;
  if (entry) authCache.delete(userId);
  return null;
}

function setCachedUser(user: AuthUser): void {
  authCache.set(user.id, { user, expires: Date.now() + AUTH_CACHE_TTL });
  if (authCache.size > 500) {
    const now = Date.now();
    for (const [key, val] of authCache) {
      if (now >= val.expires) authCache.delete(key);
    }
  }
}

export function invalidateUserCache(userId: string): void {
  authCache.delete(userId);
}

export function generateToken(userId: string): string {
  if (!JWT_SECRET) {
    throw new Error('JWT secret not configured. Cannot generate tokens.');
  }
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { sub: string } | null {
  if (!JWT_SECRET) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string };
  } catch {
    return null;
  }
}

export async function getCurrentUser(accessToken: string): Promise<AuthUser | null> {
  try {
    const payload = verifyToken(accessToken);
    if (!payload) return null;

    const cached = getCachedUser(payload.sub);
    if (cached) return cached;

    const { data, error } = await supabaseRemote
      .from('profiles')
      .select('id, email, full_name, username, avatar_url, account_type, internal_role, status, onboarding_completed, subscription_plan_id')
      .eq('id', payload.sub)
      .eq('status', 'active')
      .single();

    if (error || !data) return null;
    const user = data as AuthUser;
    setCachedUser(user);
    return user;
  } catch {
    return null;
  }
}

const planCache = new Map<string, { data: any; expires: number }>();

export async function getUserWithPlan(userId: string) {
  const cached = planCache.get(userId);
  if (cached && Date.now() < cached.expires) return cached.data;

  const { data, error } = await supabaseRemote
    .from('profiles')
    .select('id, email, full_name, username, avatar_url, account_type, internal_role, status, onboarding_completed, subscription_plan_id, onboarding_progress, subscription_status, subscription_plans(slug, name, price_monthly)')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  const plan = data.subscription_plans as any;
  const result = {
    ...data,
    plan_slug: plan?.slug || null,
    plan_name: plan?.name || null,
    price_monthly: plan?.price_monthly || null,
  };

  planCache.set(userId, { data: result, expires: Date.now() + AUTH_CACHE_TTL });
  return result;
}

export function invalidateAllUserCaches(userId: string): void {
  authCache.delete(userId);
  planCache.delete(userId);
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  getCurrentUser(token).then(user => {
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    req.accessToken = token;
    next();
  }).catch(() => {
    return res.status(401).json({ error: 'Authentication failed' });
  });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  getCurrentUser(token).then(user => {
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const adminRoles = ['admin', 'super_admin', 'editor', 'moderator'];
    if (!user.internal_role || !adminRoles.includes(user.internal_role)) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = user;
    req.accessToken = token;
    next();
  }).catch(() => {
    return res.status(401).json({ error: 'Authentication failed' });
  });
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    next();
    return;
  }

  getCurrentUser(token).then(user => {
    if (user) {
      req.user = user;
      req.accessToken = token;
    }
    next();
  }).catch(() => {
    next();
  });
}
