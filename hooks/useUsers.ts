import { useState } from "react";
import supabase from "utils/supabase";

interface ReturnType {
  data?: any;
  err: string | null;
}

const useUsers = () => {
  const [isLoading, setIsLoading] = useState(false);

  async function AllUsers(): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) throw new Error(error.message);
      if (!data || data.length === 0) throw new Error("No users found");

      return { data, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function DeleteUser(id: string): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data: supabaseData, error: supabaseError } = await supabase
        .from("users")
        .delete()
        .eq("id", id)
        .select();

      if (supabaseError) throw new Error(supabaseError.message);

      // Removed auth update part as per your instruction
      return { data: supabaseData, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function UpdateUser(id: string, newData: object): Promise<ReturnType> {
    setIsLoading(true);
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .update(newData)
        .eq("id", id)
        .select();

      if (userError) throw new Error(userError.message);

      // Removed auth update part as per your instruction

      return { data: { userData }, err: null };
    } catch (error: unknown) {
      return { data: null, err: String(error) };
    } finally {
      setIsLoading(false);
    }
  }

  async function NewUser(newUserData: object): Promise<ReturnType> {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }

  return {
    AllUsers,
    DeleteUser,
    UpdateUser,
    NewUser,
    isLoading,
  };
};

export default useUsers;
