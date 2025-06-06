import React, { useState } from "react";
import RegisterForm from "components/RegisterForm";
import LoginIllustrator from "/assets/images/Login-illustrator.png";
import useAuth from "hooks/useAuth";
import Alert from "components/Alert";
import { useMutation } from "@tanstack/react-query";

export function meta() {
  return [{ title: "Alisom Online market - Login" }];
}

const Login: React.FC = () => {
  const { login, continueWithGoogle } = useAuth();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertType, setAlertType] = useState<
    "danger" | "info" | "success" | "warning"
  >("danger");

  const loginMutation = useMutation({
    mutationFn: async (formData: { email: string; password: string }) =>
      await login(formData.email, formData.password),
    onSuccess: ({ user }) => {
      if (user) {
        console.log("Login successful!", user);
        setAlertTitle("Login Successful");
        setAlertMessage("You have successfully logged in.");
        setAlertType("success");
        setAlertOpen(true);
        window.location.href = "/user/account";
      } else {
        console.warn("No user returned from login.");
        setAlertTitle("Login Error");
        setAlertMessage("No user returned from login.");
        setAlertType("warning");
        setAlertOpen(true);
      }
    },
    onError: (error: any) => {
      console.error("Login failed:", error.message || error);
      setAlertTitle("Login Failed");
      setAlertMessage(error.message || "Unexpected error");
      setAlertType("danger");
      setAlertOpen(true);
    },
  });

  const googleMutation = useMutation({
    mutationFn: async () => await continueWithGoogle(),
    onSuccess: ({ error }) => {
      if (error) {
        setAlertTitle("Error signing Up with Google");
        setAlertMessage(error);
        setAlertType("danger");
        setAlertOpen(true);
      }
      // Optional: handle post-success behavior
    },
    onError: (error: any) => {
      console.error("Google sign-in failed:", error.message || error);
      setAlertTitle("Google Sign-In Failed");
      setAlertMessage(error.message || "Unexpected error");
      setAlertType("danger");
      setAlertOpen(true);
    },
  });

  const handleSubmit = (formData: { email: string; password: string }) => {
    loginMutation.mutate(formData);
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
        title={alertTitle}
        description={alertMessage}
        type={alertType}
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
      />

      <div className="relative flex flex-col lg:flex-row justify-between items-center w-full max-w-7xl">
        <div className="w-full lg:w-1/2 overflow-hidden hidden lg:block">
          <img src={LoginIllustrator} alt="login illustrator" />
        </div>

        <div className="w-full lg:w-1/2">
          <RegisterForm
            isLogin={true}
            onSubmit={handleSubmit}
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={loginMutation.isPending || googleMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
