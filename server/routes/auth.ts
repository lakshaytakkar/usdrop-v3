import { Router, type Express, type Request, type Response } from 'express';
import { supabaseAdmin, createSupabaseClientForUser } from '../lib/supabase';
import { requireAuth, optionalAuth, getCurrentUser, getUserWithPlan } from '../lib/auth';

function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true };
}

function validatePassword(password: string): { valid: boolean; errors: string[]; strength: number } {
  const errors: string[] = [];
  if (!password) {
    return { valid: false, errors: ['Password is required'], strength: 0 };
  }
  if (password.length < 8) errors.push('Password must be at least 8 characters long');
  if (password.length > 128) errors.push('Password must be less than 128 characters');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/\d/.test(password)) errors.push('Password must contain at least one number');

  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[^a-zA-Z\d]/.test(password)) strength++;

  return { valid: errors.length === 0, errors, strength: Math.min(strength, 4) };
}

function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  if (!phone) {
    return { valid: false, error: 'Phone number is required' };
  }
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: 'Invalid phone number format' };
  }
  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return { valid: false, error: 'Phone number must be between 7 and 15 digits' };
  }
  return { valid: true };
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function registerAuthRoutes(app: Express) {
  const router = Router();

  // POST /api/auth/signin
  router.post('/signin', async (req: Request, res: Response) => {
    try {
      const { access_token } = req.body;

      if (!access_token) {
        return res.status(400).json({ error: 'Access token is required' });
      }

      const supabase = createSupabaseClientForUser(access_token);
      const { data: { user: supaUser }, error } = await supabase.auth.getUser();

      if (error || !supaUser) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const { data: profileCheck } = await supabaseAdmin
        .from('profiles')
        .select('status')
        .eq('id', supaUser.id)
        .single();

      if (profileCheck?.status === 'suspended') {
        return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
      }

      const profile = await getUserWithPlan(supaUser.id);
      const isInternal = profile?.internal_role !== null && profile?.internal_role !== undefined;
      const requiresOnboarding = !profile?.onboarding_completed && !isInternal;
      const plan = profile?.plan_slug || profile?.account_type || 'free';
      const planName = profile?.plan_name || 'Free';

      return res.json({
        message: 'Signed in successfully',
        user: { id: supaUser.id, email: supaUser.email, user_metadata: { full_name: profile?.full_name } },
        isInternal,
        requiresOnboarding,
        plan,
        planName,
      });
    } catch (error) {
      console.error('Signin error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  // POST /api/auth/signup
  router.post('/signup', async (req: Request, res: Response) => {
    try {
      const { access_token, full_name } = req.body;

      if (!access_token) {
        return res.status(400).json({ error: 'Access token is required' });
      }

      const supabase = createSupabaseClientForUser(access_token);
      const { data: { user: supaUser }, error } = await supabase.auth.getUser();

      if (error || !supaUser) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      const { data: freePlan } = await supabaseAdmin
        .from('subscription_plans')
        .select('id')
        .eq('slug', 'free')
        .single();

      if (freePlan) {
        await supabaseAdmin
          .from('profiles')
          .update({ subscription_plan_id: freePlan.id })
          .eq('id', supaUser.id);
      }

      return res.json({
        message: 'Account created successfully',
        user: { id: supaUser.id, email: supaUser.email, full_name: full_name || null },
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  // POST /api/auth/signout
  router.post('/signout', async (_req: Request, res: Response) => {
    try {
      return res.json({ message: 'Signed out successfully' });
    } catch (error) {
      console.error('Signout error:', error);
      return res.json({ message: 'Signed out successfully' });
    }
  });

  // GET /api/auth/user
  router.get('/user', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const profile = await getUserWithPlan(user.id);
      if (!profile) {
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }

      return res.json({
        user: {
          id: profile.id,
          full_name: profile.full_name,
          email: profile.email,
          username: profile.username,
          avatar_url: profile.avatar_url,
          account_type: profile.account_type || 'free',
          internal_role: profile.internal_role,
          status: profile.status || 'active',
          onboarding_completed: profile.onboarding_completed,
        },
        plan: profile.plan_slug || profile.account_type || 'free',
        planName: profile.plan_name || 'Free',
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET /api/auth/user/metadata
  router.get('/user/metadata', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select(`
          id, email, full_name, username, avatar_url,
          internal_role, subscription_plan_id, account_type,
          status, onboarding_completed, subscription_status,
          subscription_plans!profiles_subscription_plan_id_fkey (slug, name)
        `)
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }

      const planData = (profile as any).subscription_plans;
      const plan = planData?.slug || profile.account_type || 'free';
      const planName = planData?.name || (profile.account_type === 'pro' ? 'Pro' : 'Free');

      const isInternal = profile.internal_role !== null && profile.internal_role !== undefined;
      const isExternal = !isInternal;

      return res.json({
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        username: profile.username,
        avatar_url: profile.avatar_url,
        is_internal: isInternal,
        internal_role: profile.internal_role,
        is_external: isExternal,
        plan,
        plan_name: planName,
        status: profile.status || 'active',
        onboarding_completed: profile.onboarding_completed ?? false,
        subscription_status: profile.subscription_status,
      });
    } catch (error) {
      console.error('Error fetching user metadata:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST /api/auth/change-email
  router.post('/change-email', requireAuth, async (req: Request, res: Response) => {
    try {
      const { newEmail } = req.body;
      const user = req.user!;
      const token = req.accessToken!;

      if (!newEmail) {
        return res.status(400).json({ error: 'New email address is required' });
      }

      const emailValidation = validateEmail(newEmail);
      if (!emailValidation.valid) {
        return res.status(400).json({ error: emailValidation.error });
      }

      if (user.email.toLowerCase() === newEmail.toLowerCase()) {
        return res.status(400).json({ error: 'New email address must be different from your current email.' });
      }

      const supabase = createSupabaseClientForUser(token);
      const { error } = await supabase.auth.updateUser({ email: newEmail });

      if (error) {
        if (error.message?.includes('already') || error.message?.includes('exists')) {
          return res.status(409).json({ error: 'An account with this email address already exists.' });
        }
        return res.status(400).json({ error: error.message || 'Failed to update email' });
      }

      await supabaseAdmin
        .from('profiles')
        .update({ email: newEmail.toLowerCase() })
        .eq('id', user.id);

      return res.json({
        message: 'Email address updated successfully.',
        email: user.email,
        newEmail: newEmail,
      });
    } catch (error) {
      console.error('Change email error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  // POST /api/auth/forgot-password
  router.post('/forgot-password', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(400).json({ error: emailValidation.error });
      }

      await supabaseAdmin.auth.resetPasswordForEmail(email);

      return res.json({
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  // GET /api/auth/google
  router.get('/google', async (_req: Request, res: Response) => {
    return res.status(503).json({
      error: 'Google sign-in is currently unavailable. Please use email and password to sign in.',
    });
  });

  // POST /api/auth/magic-link/signup
  router.post('/magic-link/signup', async (_req: Request, res: Response) => {
    return res.status(503).json({
      error: 'Magic link signup is currently unavailable. Please use email and password to sign up.',
    });
  });

  // POST /api/auth/onboarding
  router.post('/onboarding', requireAuth, async (req: Request, res: Response) => {
    try {
      const { phone_number, ecommerce_experience, preferred_niche } = req.body;
      const user = req.user!;

      if (!phone_number) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      if (!ecommerce_experience) {
        return res.status(400).json({ error: 'Ecommerce experience is required' });
      }

      if (!preferred_niche) {
        return res.status(400).json({ error: 'Preferred niche is required' });
      }

      const phoneValidation = validatePhoneNumber(phone_number);
      if (!phoneValidation.valid) {
        return res.status(400).json({ error: phoneValidation.error });
      }

      const validExperiences = ['none', 'beginner', 'intermediate', 'advanced', 'expert'];
      if (!validExperiences.includes(ecommerce_experience)) {
        return res.status(400).json({ error: 'Invalid ecommerce experience value' });
      }

      const validNiches = ['fashion', 'electronics', 'home-garden', 'health-beauty', 'sports', 'toys-games', 'automotive', 'pet-supplies', 'food-beverage', 'other'];
      if (!validNiches.includes(preferred_niche)) {
        return res.status(400).json({ error: 'Invalid preferred niche value' });
      }

      const { error } = await supabaseAdmin
        .from('profiles')
        .update({
          phone_number,
          ecommerce_experience,
          preferred_niche,
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      return res.json({
        message: 'Profile setup completed successfully',
        profile_setup_completed: true,
      });
    } catch (error) {
      console.error('Onboarding error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return res.status(500).json({ error: `Internal server error: ${errorMessage}` });
    }
  });

  // GET /api/auth/onboarding/status
  router.get('/onboarding/status', optionalAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user;

      if (!user) {
        return res.json({ onboarding_completed: false });
      }

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      return res.json({
        onboarding_completed: profile?.onboarding_completed || false,
      });
    } catch (error) {
      console.error('Onboarding status check error:', error);
      return res.json({ onboarding_completed: false });
    }
  });

  // POST /api/auth/otp/request
  router.post('/otp/request', async (_req: Request, res: Response) => {
    return res.status(503).json({
      error: 'OTP authentication is currently unavailable. Please use email and password to sign in.',
    });
  });

  // POST /api/auth/otp/verify
  router.post('/otp/verify', async (_req: Request, res: Response) => {
    return res.status(503).json({
      error: 'OTP verification is currently unavailable. Please use email and password to sign in.',
    });
  });

  // POST /api/auth/reauthenticate
  router.post('/reauthenticate', requireAuth, async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const user = req.user!;

      if (!password) {
        return res.status(400).json({ error: 'Password is required for reauthentication.' });
      }

      const { error } = await supabaseAdmin.auth.signInWithPassword({
        email: user.email,
        password,
      });

      if (error) {
        return res.status(401).json({ error: 'Invalid password. Please try again.' });
      }

      return res.json({
        message: 'Reauthentication successful',
        authenticated: true,
      });
    } catch (error) {
      console.error('Reauthentication error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  // POST /api/auth/resend-verification
  router.post('/resend-verification', async (_req: Request, res: Response) => {
    return res.json({
      message: 'If your email needs verification, a new verification link has been sent.',
    });
  });

  // POST /api/auth/reset-password
  router.post('/reset-password', async (req: Request, res: Response) => {
    try {
      const { password, access_token } = req.body;

      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({
          error: passwordValidation.errors[0] || 'Invalid password',
          errors: passwordValidation.errors,
        });
      }

      const token = access_token || extractToken(req);
      if (!token) {
        return res.status(401).json({ error: 'No active session found. Please click the password reset link from your email again.' });
      }

      const supabase = createSupabaseClientForUser(token);
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        if (error.message?.includes('session') || error.message?.includes('not authenticated')) {
          return res.status(401).json({ error: 'No active session found. Please click the password reset link from your email again.' });
        }
        return res.status(400).json({ error: error.message || 'Failed to reset password' });
      }

      await supabase.auth.signOut();

      return res.json({
        message: 'Password reset successfully. Please sign in with your new password.',
      });
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  app.use('/api/auth', router);
}
