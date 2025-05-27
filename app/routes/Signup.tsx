import React, { useState } from "react";
import RegisterForm from "components/RegisterForm";
import SignupIllustrator from "/assets/images/Login-illustrator.png";
import useAuth from "hooks/useAuth";
import Alert from "components/Alert";
import { useMutation } from "@tanstack/react-query";

export function meta() {
  return [{ title: "Alisom Online Market - Signup" }];
}

const Signup: React.FC = () => {
  const { signup, continueWithGoogle } = useAuth();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "warning" | "danger" | "info"
  >("info");
  const [formError, setFormError] = useState<string | null>(null);

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
    onSuccess: () => {
      setAlertTitle("Signup Successful");
      setAlertMessage("Welcome aboard!");
      setAlertType("success");
      setAlertOpen(true);
      setFormError(null);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    },
    onError: (error: any) => {
      const errorMsg =
        error?.message || error?.toString() || "Unexpected error occurred.";
      setAlertTitle("Signup Error");
      setAlertMessage(errorMsg);
      setAlertType("danger");
      setAlertOpen(true);
      setFormError(errorMsg);
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
      const errorMsg =
        error?.message || error?.toString() || "Unexpected error occurred.";
      setAlertTitle("Google Sign-In Error");
      setAlertMessage(errorMsg);
      setAlertType("danger");
      setAlertOpen(true);
      setFormError(errorMsg);
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

      <div className="flex flex-col lg:flex-row justify-between items-center w-full max-w-7xl">
        <div className="w-full lg:w-1/2 overflow-hidden hidden lg:block">
          <img src={SignupIllustrator} alt="signup illustrator" />
        </div>

        <div className="w-full lg:w-1/2">
          <RegisterForm
            isLogin={false}
            onSubmit={handleSubmit}
            onGoogleSignIn={handleGoogleSignIn}
            loading={
              signupMutation.status === "pending" ||
              googleMutation.status === "pending"
            }
            onError={formError}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;