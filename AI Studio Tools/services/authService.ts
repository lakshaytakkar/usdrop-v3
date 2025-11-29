
import { supabase } from './supabaseClient';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export const authService = {
  signUp: async (email, password) => {
    return await supabase.auth.signUp({ email, password });
  },

  signInWithEmail: async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },
  
  signInWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },
  
  getUser: async (): Promise<SupabaseUser | null> => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.error("Error fetching user:", error);
        return null;
    }
    return data.user;
  },
  
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error("Error fetching session:", error);
        return null;
    }
    return data.session;
  },
  
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session);
    });
  }
};
