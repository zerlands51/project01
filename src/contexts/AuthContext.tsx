import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export interface User extends UserProfile {
  email: string;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SESSION'; payload: { session: Session | null; user: User | null } }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  session: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SESSION':
      return {
        ...state,
        session: action.payload.session,
        user: action.payload.user,
        isAuthenticated: !!action.payload.session,
        loading: false,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, userData: { fullName: string; phone?: string; role?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(authReducer, initialState);

  // Fetch user profile from database
  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return {
        ...profile,
        email: supabaseUser.email || '',
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Handle session changes
  const handleSessionChange = async (session: Session | null) => {
    if (session?.user) {
      const userProfile = await fetchUserProfile(session.user);
      dispatch({ type: 'SET_SESSION', payload: { session, user: userProfile } });
    } else {
      dispatch({ type: 'SET_SESSION', payload: { session: null, user: null } });
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          dispatch({ type: 'SET_ERROR', payload: error.message });
        } else {
          await handleSessionChange(session);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize authentication' });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      await handleSessionChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: { fullName: string; phone?: string; role?: string }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            phone: userData.phone,
            role: userData.role || 'user',
          },
        },
      });

      if (error) {
        throw error;
      }

      // If email confirmation is disabled, the user will be automatically signed in
      if (data.session) {
        await handleSessionChange(data.session);
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      const authError = error as AuthError;
      dispatch({ type: 'SET_ERROR', payload: authError.message });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      await handleSessionChange(data.session);
    } catch (error) {
      const authError = error as AuthError;
      dispatch({ type: 'SET_ERROR', payload: authError.message });
      throw error;
    }
  };

  const signOut = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      const authError = error as AuthError;
      dispatch({ type: 'SET_ERROR', payload: authError.message });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      const authError = error as AuthError;
      dispatch({ type: 'SET_ERROR', payload: authError.message });
      throw error;
    }
  };

  const updatePassword = async (password: string) => {
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }
    } catch (error) {
      const authError = error as AuthError;
      dispatch({ type: 'SET_ERROR', payload: authError.message });
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) {
      throw new Error('No user logged in');
    }

    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', state.user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update local state
      const updatedUser = { ...state.user, ...data };
      dispatch({ 
        type: 'SET_SESSION', 
        payload: { session: state.session, user: updatedUser } 
      });
    } catch (error) {
      const dbError = error as any;
      dispatch({ type: 'SET_ERROR', payload: dbError.message });
      throw error;
    }
  };

  const refreshSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        throw error;
      }
      await handleSessionChange(session);
    } catch (error) {
      const authError = error as AuthError;
      dispatch({ type: 'SET_ERROR', payload: authError.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const isAdmin = () => {
    return state.user?.role === 'admin' || state.user?.role === 'superadmin';
  };

  const isSuperAdmin = () => {
    return state.user?.role === 'superadmin';
  };

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError,
    isAdmin,
    isSuperAdmin,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};