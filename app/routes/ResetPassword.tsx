import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAuth from "hooks/useAuth";
import Alert from "components/Alert";
import { useMutation } from "@tanstack/react-query";

const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();

  const accessToken = searchParams.get("access_token") || "";
  const [password, setPassword] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "danger" | "info" | "success" | "warning"
  >("info");

  const resetPasswordMutation = useMutation({
    mutationFn: async (newPassword: string) => await resetPassword(accessToken, newPassword),
    onSuccess: () => {
      setAlertTitle("Success");
      setAlertMessage("Your password has been reset successfully. You can now log in.");
      setAlertType("success");
      setAlertOpen(true);
      setPassword("");
    },
    onError: (error: any) => {
      setAlertTitle("Error");
      setAlertMessage(error.message || "Unexpected error");
      setAlertType("danger");
      setAlertOpen(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setAlertTitle("Error");
      setAlertMessage("Invalid or missing token. Please request a new password reset.");
      setAlertType("danger");
      setAlertOpen(true);
      return;
    }
    resetPasswordMutation.mutate(password);
  };

  const inputClass =
    "w-full border rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF] border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-black dark:placeholder-gray-400";

  return (
    <div className="p-4 flex flex-col gap-10 justify-center items-center h-dvh">
      <Alert
        title={alertTitle}
        description={alertMessage}
        type={alertType}
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
      />

      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
          Reset Password
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Enter your new password below to reset your account password.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold flex items-center justify-center disabled:opacity-70"
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending ? (
              <>
                <div
                  className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"
                  role="status"
                  aria-label="loading"
                />
                <span className="ml-2">Resetting...</span>
              </>
            ) : (
              <span>Reset Password</span>
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

export default ResetPassword;
