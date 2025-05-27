import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import supabase from "utils/supabase";
import useUsers from "./useUsers";

interface UseAuthReturn {
  user: User | null;
  login: (email: string, password: string) => Promise<{ user: User | null }>;
  signup: (userData: {
    email: string;
    password: string;
    fullname: string;
    phone: string;
    address: string;
  }) => Promise<{ user: User | null }>;
  logout: () => Promise<void>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  continueWithGoogle: () => Promise<void>;
}

const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { NewUser } = useUsers();

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
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

  const signup = async (userData: {
    email: string;
    password: string;
    fullname: string;
    phone: string;
    address: string;
  }): Promise<{ user: User | null }> => {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });
    if (error) throw error;

    const authUser = data.user;
    if (!authUser) {
      throw new Error("User not created after signup.");
    }

    const { err: newUserError } = await NewUser({
      user_id: authUser.id,
      fullname: userData.fullname,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      password: userData.password,
    });

    if (newUserError) {
      throw new Error(newUserError);
    }

    setUser(authUser);
    return { user: authUser };
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // localStorage.removeItem("guest_wishlist");
    localStorage.removeItem("checkout_form_data");
    // localStorage.removeItem("guest_cart");
    // localStorage.removeItem("guest_order_data");
    setUser(null);
    setLoading(false);
  };

  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.email) {
      return { success: false, error: "No authenticated user." };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });

      if (error || !data.user) {
        return { success: false, error: "Current password is incorrect." };
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to update password.",
      };
    }
  };

  const continueWithGoogle = async (): Promise<void> => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://alisom-online-market.vercel.app/",
      },
    });
    if (error) throw error;
    // The user will be set after redirect and auth state change
  };

  return {
    user,
    login,
    signup,
    logout,
    updatePassword,
    continueWithGoogle,
  };
};

export default useAuth;
