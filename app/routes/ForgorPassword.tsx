import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import Alert from "components/Alert";
import { useMutation } from "@tanstack/react-query";
import UnderDevelopmentModal from "components/UnderDevelopmentModal";

export function meta() {
  return [{ title: "Alisom Online market - Forgot Password" }];
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { sendPasswordResetEmail } = useAuth();

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertType, setAlertType] = useState<
    "danger" | "info" | "success" | "warning"
  >("info");

  const emailInputRef = React.useRef<HTMLInputElement>(null);
  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => await sendPasswordResetEmail(email),
    onSuccess: () => {
      setAlertTitle("Email Sent");
      setAlertMessage(
        "If your email is registered, you will receive a password reset link shortly."
      );
      setAlertType("success");
      setAlertOpen(true);
    },
    onError: (error: unknown) => {
      let message = "Unexpected error";
      if (error instanceof Error) {
        message = error.message;
      }
      setAlertTitle("Error");
      setAlertMessage(message);
      setAlertType("danger");
      setAlertOpen(true);
    },
  });

  const [email, setEmail] = useState("");
  const [showDevModal, setShowDevModal] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPasswordMutation.mutate(email.trim());
  };

  const handleModalClose = () => {
    navigate(-1);
  };

  const inputClass =
    "w-full border rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF] border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-black dark:placeholder-gray-400";

  return (
    <div className="p-4 flex flex-col gap-10 justify-center items-center h-dvh">
      {showDevModal && <UnderDevelopmentModal onClose={handleModalClose} />}

      <Alert
        title={alertTitle}
        description={alertMessage}
        type={alertType}
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        aria-live="assertive"
      />

      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
          Forgot Password
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Enter your email to receive a password reset link.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            ref={emailInputRef}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            required
            autoComplete="email"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold flex items-center justify-center disabled:opacity-70"
            disabled={forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? (
              <>
                <div
                  className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"
                  role="status"
                  aria-label="loading"
                />
                <span className="ml-2">Please wait...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
          Remembered your password?{" "}
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 font-medium"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
