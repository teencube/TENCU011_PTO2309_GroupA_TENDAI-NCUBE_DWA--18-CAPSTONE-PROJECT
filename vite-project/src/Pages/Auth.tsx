
import React, { useState, useEffect, ReactNode } from 'react';
import supabase from '../SupabaseClient'; 
import { User } from '@supabase/supabase-js';

// This defines the shape of the authentication context
interface AuthContextProps {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean; // Loading state to track session fetching
  error: string | null; // To track errors
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Tracks whether the session is being loaded
  const [error, setError] = useState<string | null>(null); // State to handle errors

  // useEffect hook to handle fetching the session and listening for auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error: fetchError } = await supabase.auth.getSession();
      if (fetchError) {
        console.error("Error fetching session:", fetchError.message);
      } else {
        setUser(session?.user || null);
      }
      setLoading(false); // Session check complete, set loading to false
    };

    fetchSession();

    // Set up an auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Functions to sign up, login, and logout a user
  const signUp = async (email: string, password: string) => {
    setError(null); // Reset error before attempting signup
    try {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) throw new Error(signUpError.message);
    } catch (err) {
      console.error("Sign-up error:", err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const login = async (email: string, password: string) => {
    setError(null); // Reset error before attempting login
    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (loginError) throw new Error(loginError.message);
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const logout = async () => {
    setError(null); // Reset error before attempting logout
    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw new Error(logoutError.message);
      setUser(null); // Clear user on logout
    } catch (err) {
      console.error("Logout error:", err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  // Return context provider with user data and auth functions
  return (
    <AuthContext.Provider value={{ user, signUp, login, logout, loading, error }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
