import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import RegisterForm from "components/RegisterForm";
import SignupIllustrator from "/assets/images/Login-illustrator.png";
import useAuth from "hooks/useAuth";
import Alert from "components/Alert";
import useUsers from "hooks/useUsers";

export function meta() {
  return [{ title: "Alisom Online Market - Signup" }];
}

const Signup: React.FC = () => {
  const { signup, continueWithGoogle } = useAuth();
  const { NewUser } = useUsers();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertProps, setAlertProps] = useState<{
    title: string;
    description: string;
    type?: "success" | "warning" | "danger" | "info";
  }>({ title: "", description: "", type: "info" });

  const triggerAlert = (
    title: string,
    description: string,
    type: "success" | "warning" | "danger" | "info" = "info"
  ) => {
    setAlertProps({ title, description, type });
    setAlertOpen(true);
  };

  const signupMutation = useMutation({
    mutationFn: async (formData: {
      name: string;
      phone: string;
      address: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match.");
      }

      const { user: authUser } = await signup({
        email: formData.email,
        password: formData.password,
        fullname: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      if (!authUser) {
        throw new Error("No user was returned after signup. Please try again.");
      }

      return authUser;
    },
    onSuccess: (authUser) => {
      triggerAlert("Signup Successful", "Welcome aboard!", "success");
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    },
    onError: (error: any) => {
      const errorMsg =
        error?.message || error?.toString() || "Unexpected error occurred.";
      triggerAlert("Signup Error", errorMsg, "danger");
    },
  });

  const googleMutation = useMutation({
    mutationFn: async () => {
      const { error } = await continueWithGoogle();
      if (error) throw new Error(error);
    },
    onSuccess: () => {
      // Optional: Handle successful Google sign-in
    },
    onError: (error: any) => {
      const errorMsg =
        error?.message || error?.toString() || "Unexpected error occurred.";
      triggerAlert("Google Sign-In Error", errorMsg, "danger");
    },
  });

  const handleSubmit = (formData: {
    name: string;
    phone: string;
    address: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    signupMutation.mutate(formData);
  };

  const handleGoogleSignIn = () => {
    return new Promise<void>((resolve) => {
      googleMutation.mutate(undefined, {
        onSuccess: () => resolve(),
        onError: () => resolve(),
      });
    });
  };

  return (
    <div className="p-4 flex flex-col gap-10 justify-center items-center h-dvh">
      <Alert
        title={alertProps.title}
        description={alertProps.description}
        type={alertProps.type}
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
      />

      <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-7xl">
        <div className="w-full lg:w-1/2 overflow-hidden hidden lg:block">
          <img src={SignupIllustrator} alt="signup illustrator" />
        </div>

        <div className="w-full lg:w-1/2">
          <RegisterForm
            isLogin={false}
            onSubmit={handleSubmit}
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={signupMutation.isPending || googleMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
