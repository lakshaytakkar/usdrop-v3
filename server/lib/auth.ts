import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabaseRemote } from './supabase-remote';

const JWT_SECRET = process.env.JWT_SECRET || 'usdrop-dev-secret-key-change-in-production';

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

export function generateToken(userId: string): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { sub: string } | null {
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

    const { data, error } = await supabaseRemote
      .from('profiles')
      .select('id, email, full_name, username, avatar_url, account_type, internal_role, status, onboarding_completed, subscription_plan_id')
      .eq('id', payload.sub)
      .eq('status', 'active')
      .single();

    if (error || !data) return null;
    return data as AuthUser;
  } catch {
    return null;
  }
}

export async function getUserWithPlan(userId: string) {
  const { data, error } = await supabaseRemote
    .from('profiles')
    .select('id, email, full_name, username, avatar_url, account_type, internal_role, status, onboarding_completed, subscription_plan_id, onboarding_progress, subscription_plans(slug, name, price_monthly)')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  const plan = data.subscription_plans as any;
  return {
    ...data,
    plan_slug: plan?.slug || null,
    plan_name: plan?.name || null,
    price_monthly: plan?.price_monthly || null,
  };
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
