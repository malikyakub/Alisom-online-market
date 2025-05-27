import { useState } from "react";
import supabase from "utils/supabase";

interface ReturnType {
  data?: any;
  err: string | null;
}

const useUsers = () => {
  async function AllUsers(): Promise<ReturnType> {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) throw new Error("No users found");

      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  const GetUserById = async (uid: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", uid)
      .single();

    if (error) {
      return { data: null, err: error };
    }

    return { data, err: null };
  };

  async function DeleteUser(id: string): Promise<ReturnType> {
    try {
      const { data: supabaseData, error: supabaseError } = await supabase
        .from("users")
        .delete()
        .eq("id", id)
        .select();

      if (supabaseError) throw new Error(supabaseError.message);

      return { data: supabaseData, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  async function UpdateUser(id: string, newData: any): Promise<ReturnType> {
    try {
      const { data: currentUser, error: getUserError } = await supabase
        .from("users")
        .select("email")
        .eq("user_id", id)
        .single();

      if (getUserError) throw new Error(getUserError.message);
      if (!currentUser) throw new Error("User not found");

      if (newData.email && newData.email !== currentUser.email) {
        const { error: authUpdateError } = await supabase.auth.updateUser({
          email: newData.email,
        });

        if (authUpdateError) throw new Error(authUpdateError.message);
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .update(newData)
        .eq("user_id", id)
        .select();

      if (userError) throw new Error(userError.message);

      return { data: { userData }, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  async function NewUser(newUserData: object): Promise<ReturnType> {
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .insert(newUserData)
        .select();

      if (userError) throw new Error(userError.message);

      return { data: { userData }, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
    }
  }

  return {
    AllUsers,
    GetUserById,
    DeleteUser,
    UpdateUser,
    NewUser,
  };
};

export default useUsers;
