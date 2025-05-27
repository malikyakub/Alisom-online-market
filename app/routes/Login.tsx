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
  const [formError, setFormError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      const { user } = await login(formData.email, formData.password);
      if (!user) throw new Error("No user returned from login.");
      return user;
    },
    onSuccess: () => {
      setAlertTitle("Login Successful");
      setAlertMessage("You have successfully logged in.");
      setAlertType("success");
      setAlertOpen(true);
      setFormError(null);
      window.location.href = "/user/account";
    },
    onError: (error: any) => {
      setAlertTitle("Login Failed");
      setAlertMessage(error.message || "Unexpected error");
      setAlertType("danger");
      setAlertOpen(true);
      setFormError(error.message || "Unexpected error");
    },
  });

  const googleMutation = useMutation({
    mutationFn: async () => {
      await continueWithGoogle();
    },
    onSuccess: () => {
      setAlertTitle("Google Sign-In Successful");
      setAlertMessage("You have successfully signed in with Google.");
      setAlertType("success");
      setAlertOpen(true);
      setFormError(null);
    },
    onError: (error: any) => {
      setAlertTitle("Google Sign-In Failed");
      setAlertMessage(error.message || "Unexpected error");
      setAlertType("danger");
      setAlertOpen(true);
      setFormError(error.message || "Unexpected error");
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
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  const handleGoogleSignIn = () => {
    googleMutation.mutate();
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
            loading={loginMutation.status === "pending" || googleMutation.status === "pending"}
            onError={formError}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
