import { Router, type Express, type Request, type Response } from 'express';
import bcrypt from 'bcryptjs';
import { supabaseRemote } from '../lib/supabase-remote';
import { supabaseAuth, getSupabaseAuthUrl, getSupabaseAnonKey } from '../lib/supabase-auth';
import { requireAuth, optionalAuth, getUserWithPlan, generateToken } from '../lib/auth';

const ALLOWED_REDIRECT_PATHS = ['/home', '/admin', '/framework', '/product-hunt', '/mentorship', '/categories', '/suppliers', '/competitor-stores', '/tools', '/blogs', '/shipping-calculator', '/onboarding'];

function sanitizeRedirectPath(path: string): string {
  if (!path || typeof path !== 'string') return '/home';
  const decoded = decodeURIComponent(path);
  if (decoded.startsWith('http') || decoded.startsWith('//') || decoded.includes('\\')) return '/home';
  if (!decoded.startsWith('/')) return '/home';
  const basePath = decoded.split('?')[0].split('#')[0];
  if (ALLOWED_REDIRECT_PATHS.some(p => basePath === p || basePath.startsWith(p + '/'))) {
    return decoded;
  }
  return '/home';
}

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

async function findOrCreateProfile(email: string, fullName?: string | null, avatarUrl?: string | null) {
  const { data: existing } = await supabaseRemote
    .from('profiles')
    .select('id, email, status, full_name')
    .eq('email', email.toLowerCase())
    .single();

  if (existing) {
    return existing;
  }

  const { data: freePlan } = await supabaseRemote
    .from('subscription_plans')
    .select('id')
    .eq('slug', 'free')
    .single();

  const { data: newProfile, error: insertError } = await supabaseRemote
    .from('profiles')
    .insert({
      email: email.toLowerCase(),
      full_name: fullName || null,
      avatar_url: avatarUrl || null,
      subscription_plan_id: freePlan?.id || null,
      status: 'active',
      account_type: 'free',
    })
    .select('id, email, status, full_name')
    .single();

  if (insertError) {
    console.error('Profile creation error:', insertError);
    return null;
  }

  return newProfile;
}

function getAppBaseUrl(req: Request): string {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  return `${proto}://${host}`;
}

export function registerAuthRoutes(app: Express) {
  const router = Router();

  router.post('/signin', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const { data: profile, error } = await supabaseRemote
        .from('profiles')
        .select('id, email, password_hash, status')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !profile) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (profile.status === 'suspended') {
        return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
      }

      if (!profile.password_hash) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const valid = await bcrypt.compare(password, profile.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = generateToken(profile.id);
      const fullProfile = await getUserWithPlan(profile.id);

      const isInternal = fullProfile?.internal_role !== null && fullProfile?.internal_role !== undefined;
      const requiresOnboarding = !fullProfile?.onboarding_completed && !isInternal;
      const plan = fullProfile?.plan_slug || fullProfile?.account_type || 'free';
      const planName = fullProfile?.plan_name || 'Free';

      return res.json({
        message: 'Signed in successfully',
        token,
        user: { id: profile.id, email: profile.email, user_metadata: { full_name: fullProfile?.full_name } },
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

  router.post('/signup', async (req: Request, res: Response) => {
    try {
      const { email, password, full_name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(400).json({ error: emailValidation.error });
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.errors[0], errors: passwordValidation.errors });
      }

      const { data: existing } = await supabaseRemote
        .from('profiles')
        .select('id')
        .eq('email', email.toLowerCase())
        .single();

      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const hash = await bcrypt.hash(password, 10);

      const { data: freePlan } = await supabaseRemote
        .from('subscription_plans')
        .select('id')
        .eq('slug', 'free')
        .single();

      const { data: newProfile, error: insertError } = await supabaseRemote
        .from('profiles')
        .insert({
          email: email.toLowerCase(),
          password_hash: hash,
          full_name: full_name || null,
          subscription_plan_id: freePlan?.id || null,
          status: 'active',
          account_type: 'free',
        })
        .select('id, email')
        .single();

      if (insertError || !newProfile) {
        console.error('Signup insert error:', insertError);
        return res.status(500).json({ error: 'Failed to create account. Please try again.' });
      }

      const token = generateToken(newProfile.id);

      return res.json({
        message: 'Account created successfully',
        token,
        user: { id: newProfile.id, email: newProfile.email, full_name: full_name || null },
      });
    } catch (error: any) {
      console.error('Signup error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  router.post('/signout', async (_req: Request, res: Response) => {
    try {
      return res.json({ message: 'Signed out successfully' });
    } catch (error) {
      console.error('Signout error:', error);
      return res.json({ message: 'Signed out successfully' });
    }
  });

  router.get('/user', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const profile = await getUserWithPlan(user.id);
      if (!profile) {
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }

      const isInternal = profile.internal_role !== null && profile.internal_role !== undefined;
      const plan = profile.plan_slug || profile.account_type || 'free';
      const planName = profile.plan_name || 'Free';

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
        plan,
        planName,
        metadata: {
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name,
          username: profile.username,
          avatar_url: profile.avatar_url,
          is_internal: isInternal,
          internal_role: profile.internal_role,
          is_external: !isInternal,
          plan,
          plan_name: planName,
          status: profile.status || 'active',
          onboarding_completed: profile.onboarding_completed ?? false,
          subscription_status: (profile as any).subscription_status || null,
        },
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/user/metadata', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const { data: profile, error } = await supabaseRemote
        .from('profiles')
        .select('id, email, full_name, username, avatar_url, internal_role, subscription_plan_id, account_type, status, onboarding_completed, subscription_status, subscription_plans(slug, name)')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }

      const planData = profile.subscription_plans as any;
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

  router.post('/change-email', requireAuth, async (req: Request, res: Response) => {
    try {
      const { newEmail } = req.body;
      const user = req.user!;

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

      const { data: existing } = await supabaseRemote
        .from('profiles')
        .select('id')
        .eq('email', newEmail.toLowerCase())
        .neq('id', user.id)
        .single();

      if (existing) {
        return res.status(409).json({ error: 'An account with this email address already exists.' });
      }

      await supabaseRemote
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
      return res.json({
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  router.get('/google', async (req: Request, res: Response) => {
    try {
      const redirectTo = sanitizeRedirectPath(req.query.redirectTo as string || '/home');
      const isSignup = req.query.signup === 'true';
      const baseUrl = getAppBaseUrl(req);
      const callbackUrl = `${baseUrl}/api/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}&signup=${isSignup ? 'true' : 'false'}`;

      const { data, error } = await supabaseAuth.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error || !data?.url) {
        console.error('Google OAuth error:', error);
        return res.status(500).json({
          error: 'Google sign-in is currently unavailable. Please ensure Google OAuth is configured in your Supabase dashboard.',
        });
      }

      return res.redirect(data.url);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  router.get('/callback', async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;
      const redirectTo = sanitizeRedirectPath(req.query.redirectTo as string || '/home');

      if (!code) {
        return res.redirect(`/login?error=${encodeURIComponent('Authentication failed. No authorization code received.')}`);
      }

      const { data, error } = await supabaseAuth.auth.exchangeCodeForSession(code);

      if (error || !data?.user?.email) {
        console.error('OAuth callback error:', error);
        return res.redirect(`/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
      }

      const supabaseUser = data.user;
      const fullName = supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || null;
      const avatarUrl = supabaseUser.user_metadata?.avatar_url || supabaseUser.user_metadata?.picture || null;

      const profile = await findOrCreateProfile(supabaseUser.email!, fullName, avatarUrl);
      if (!profile) {
        return res.redirect(`/login?error=${encodeURIComponent('Failed to create account. Please try again.')}`);
      }

      if (profile.status === 'suspended') {
        return res.redirect(`/login?error=${encodeURIComponent('Your account has been suspended. Please contact support.')}`);
      }

      if (avatarUrl || fullName) {
        await supabaseRemote
          .from('profiles')
          .update({
            ...(avatarUrl ? { avatar_url: avatarUrl } : {}),
            ...(fullName && !profile.full_name ? { full_name: fullName } : {}),
          })
          .eq('id', profile.id);
      }

      const localToken = generateToken(profile.id);

      return res.redirect(`/auth/callback#token=${localToken}&redirectTo=${encodeURIComponent(redirectTo)}`);
    } catch (error) {
      console.error('OAuth callback error:', error);
      return res.redirect(`/login?error=${encodeURIComponent('Authentication failed. Please try again.')}`);
    }
  });

  router.post('/magic-link/signup', async (req: Request, res: Response) => {
    try {
      const { email, full_name } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(400).json({ error: emailValidation.error });
      }

      const { error } = await supabaseAuth.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          shouldCreateUser: true,
          data: { full_name: full_name || undefined },
        },
      });

      if (error) {
        console.error('Magic link signup error:', error);
        return res.status(400).json({ error: error.message || 'Failed to send verification email' });
      }

      return res.json({
        message: 'Verification code sent! Please check your email.',
        email: email.toLowerCase(),
      });
    } catch (error) {
      console.error('Magic link signup error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  router.post('/onboarding', requireAuth, async (req: Request, res: Response) => {
    try {
      const { phone_number, ecommerce_experience, preferred_niche } = req.body;
      const user = req.user!;

      if (!phone_number) return res.status(400).json({ error: 'Phone number is required' });
      if (!ecommerce_experience) return res.status(400).json({ error: 'Ecommerce experience is required' });
      if (!preferred_niche) return res.status(400).json({ error: 'Preferred niche is required' });

      const phoneValidation = validatePhoneNumber(phone_number);
      if (!phoneValidation.valid) return res.status(400).json({ error: phoneValidation.error });

      const validExperiences = ['none', 'beginner', 'intermediate', 'advanced', 'expert'];
      if (!validExperiences.includes(ecommerce_experience)) {
        return res.status(400).json({ error: 'Invalid ecommerce experience value' });
      }

      const validNiches = ['fashion', 'electronics', 'home-garden', 'health-beauty', 'sports', 'toys-games', 'automotive', 'pet-supplies', 'food-beverage', 'other'];
      if (!validNiches.includes(preferred_niche)) {
        return res.status(400).json({ error: 'Invalid preferred niche value' });
      }

      const { error } = await supabaseRemote
        .from('profiles')
        .update({ phone_number, ecommerce_experience, preferred_niche })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      return res.json({ message: 'Profile setup completed successfully', profile_setup_completed: true });
    } catch (error) {
      console.error('Onboarding error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/onboarding/status', optionalAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user;
      if (!user) return res.json({ onboarding_completed: false });

      const { data: profile } = await supabaseRemote
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      return res.json({ onboarding_completed: profile?.onboarding_completed || false });
    } catch (error) {
      console.error('Onboarding status check error:', error);
      return res.json({ onboarding_completed: false });
    }
  });

  router.post('/otp/request', async (req: Request, res: Response) => {
    try {
      const { email, full_name } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        return res.status(400).json({ error: emailValidation.error });
      }

      const { error } = await supabaseAuth.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          shouldCreateUser: true,
          data: { full_name: full_name || undefined },
        },
      });

      if (error) {
        console.error('OTP request error:', error);
        if (error.message?.includes('rate limit') || error.status === 429) {
          return res.status(429).json({ error: 'Please wait before requesting another code.' });
        }
        if (error.message?.includes('invalid') && error.message?.includes('Email')) {
          return res.status(400).json({
            error: 'Unable to send verification code to this email. Please try Google sign-up or contact support.',
            code: 'email_send_failed',
          });
        }
        if (error.message?.includes('not authorized')) {
          return res.status(400).json({
            error: 'This email is not authorized. A custom SMTP provider is required for email sign-up.',
            code: 'email_not_authorized',
          });
        }
        return res.status(400).json({ error: error.message || 'Failed to send verification code' });
      }

      return res.json({
        message: 'Verification code sent! Please check your email.',
        email: email.toLowerCase(),
      });
    } catch (error) {
      console.error('OTP request error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  router.post('/otp/verify', async (req: Request, res: Response) => {
    try {
      const { email, token } = req.body;

      if (!email || !token) {
        return res.status(400).json({ error: 'Email and verification code are required' });
      }

      if (token.length !== 6 || !/^\d{6}$/.test(token)) {
        return res.status(400).json({ error: 'Please enter a valid 6-digit code' });
      }

      const { data: verifyData, error: verifyError } = await supabaseAuth.auth.verifyOtp({
        email: email.toLowerCase(),
        token,
        type: 'email',
      });

      if (verifyError) {
        console.error('OTP verify error:', verifyError);
        if (verifyError.message?.includes('expired')) {
          return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
        }
        return res.status(400).json({ error: verifyError.message || 'Invalid verification code' });
      }

      const supabaseUser = verifyData?.user;
      if (!supabaseUser?.email) {
        return res.status(400).json({ error: 'Verification failed. Please try again.' });
      }

      const fullName = supabaseUser.user_metadata?.full_name || null;
      const avatarUrl = supabaseUser.user_metadata?.avatar_url || null;

      const profile = await findOrCreateProfile(supabaseUser.email, fullName, avatarUrl);
      if (!profile) {
        return res.status(500).json({ error: 'Failed to create account. Please try again.' });
      }

      if (profile.status === 'suspended') {
        return res.status(403).json({ error: 'Your account has been suspended. Please contact support.' });
      }

      const localToken = generateToken(profile.id);
      const fullProfile = await getUserWithPlan(profile.id);

      const isInternal = fullProfile?.internal_role !== null && fullProfile?.internal_role !== undefined;
      const requiresOnboarding = !fullProfile?.onboarding_completed && !isInternal;

      return res.json({
        message: 'Signed in successfully',
        token: localToken,
        user: {
          id: profile.id,
          email: profile.email,
          user_metadata: { full_name: fullProfile?.full_name },
        },
        isInternal,
        requiresOnboarding,
        plan: fullProfile?.plan_slug || fullProfile?.account_type || 'free',
        planName: fullProfile?.plan_name || 'Free',
      });
    } catch (error) {
      console.error('OTP verify error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  router.post('/reauthenticate', requireAuth, async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const user = req.user!;

      if (!password) {
        return res.status(400).json({ error: 'Password is required for reauthentication.' });
      }

      const { data: profile } = await supabaseRemote
        .from('profiles')
        .select('password_hash')
        .eq('id', user.id)
        .single();

      if (!profile || !profile.password_hash) {
        return res.status(401).json({ error: 'Invalid password. Please try again.' });
      }

      const valid = await bcrypt.compare(password, profile.password_hash);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid password. Please try again.' });
      }

      return res.json({ message: 'Reauthentication successful', authenticated: true });
    } catch (error) {
      console.error('Reauthentication error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  router.post('/resend-verification', async (_req: Request, res: Response) => {
    return res.json({ message: 'If your email needs verification, a new verification link has been sent.' });
  });

  router.post('/reset-password', requireAuth, async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      const user = req.user!;

      if (!password) return res.status(400).json({ error: 'Password is required' });

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ error: passwordValidation.errors[0], errors: passwordValidation.errors });
      }

      const hash = await bcrypt.hash(password, 10);
      await supabaseRemote
        .from('profiles')
        .update({ password_hash: hash })
        .eq('id', user.id);

      return res.json({ message: 'Password reset successfully. Please sign in with your new password.' });
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  });

  app.use('/api/auth', router);

  const userRouter = Router();

  userRouter.get('/module-overrides', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = req.user!;

      const { data: overrides, error } = await supabaseRemote
        .from('user_module_overrides')
        .select('module_id, access_level')
        .eq('user_id', user.id);

      if (error) {
        if (error.code === 'PGRST205' || error.code === '42P01') {
          return res.json({ overrides: [] });
        }
        console.error('Error fetching module overrides:', error);
        return res.json({ overrides: [] });
      }

      return res.json({
        overrides: (overrides || []).map((o: any) => ({
          moduleId: o.module_id,
          accessLevel: o.access_level,
        })),
      });
    } catch (error) {
      console.error('Error in GET /api/user/module-overrides:', error);
      return res.json({ overrides: [] });
    }
  });

  app.use('/api/user', userRouter);
}
