
import React, { useState, useEffect, ReactNode } from 'react';
import supabase from '../SupabaseClient'; 
import { User } from '@supabase/supabase-js';

//This defines the shape of the authentication context
interface AuthContextProps {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean; // Loading state to track session fetching
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Tracks whether the session is being loaded

  // useEffect hook to handle fetching the session and listening for auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
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
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw new Error(error.message);
    } catch (err) {
      console.error("Sign-up error:", err);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
    } catch (err) {
      console.error("Logout error:", err);
      throw err;
    }
  };

  // Return context provider with user data and auth functions
  return (
    <AuthContext.Provider value={{ user, signUp, login, logout, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
