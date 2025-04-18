import { useState, useEffect } from "react";
import type { Session, User, AuthError } from "@supabase/supabase-js";
import supabase from "utils/supabase";

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: User | null }>;
  signup: (email: string, password: string) => Promise<{ user: User | null }>;
  logout: () => Promise<void>;
}

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
        setUser(null);
      } else {
        setUser(data.session?.user ?? null);
      }
      setLoading(false);
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ user: User | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
    return { user: data.user };
  };

  const signup = async (
    email: string,
    password: string
  ): Promise<{ user: User | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    setUser(data.user);
    return { user: data.user };
  };

  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    signup,
    logout,
  };
};

export default useAuth;
