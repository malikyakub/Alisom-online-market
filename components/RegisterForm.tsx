import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import type { ChangeEvent } from "react";

type RegisterFormProps = {
  isLogin?: boolean;
  onSubmit?: (formData: FormData) => void;
  onGoogleSignIn?: () => void;
  loading?: boolean;
  onError?: string | null;
};

type FormData = {
  name: string;
  phone: string;
  address: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  isLogin = false,
  onSubmit,
  onGoogleSignIn,
  loading = false,
  onError = null,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(!!onError);
  }, [onError]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const inputClass = hasError
    ? "w-full border rounded px-4 py-2 border-[#DC3545] bg-[#DC3545]/30 focus:border-[#DC3545] focus:bg-[#DC3545]/30 dark:bg-gray-800 dark:text-black dark:placeholder-gray-400"
    : "w-full border rounded px-4 py-2 border-gray-300 focus:bg-blue-100/30 focus:border-[#007BFF] dark:border-gray-600 dark:bg-gray-800 dark:text-black dark:placeholder-gray-400";

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {isLogin
            ? "Enter your credentials to login"
            : "Enter your details below"}
        </p>
        <form className="space-y-4" onSubmit={handleFormSubmit}>
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className={inputClass}
                disabled={loading}
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className={inputClass}
                disabled={loading}
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className={inputClass}
                disabled={loading}
              />
            </>
          )}
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={inputClass}
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={isLogin ? "Password" : "Create Password"}
            className={inputClass}
            disabled={loading}
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className={inputClass}
              disabled={loading}
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold flex items-center justify-center disabled:opacity-70"
          >
            <span>{isLogin ? "Log In" : "Create Account"}</span>
          </button>
        </form>
        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="mx-4 text-gray-500 dark:text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (onGoogleSignIn) onGoogleSignIn();
          }}
          disabled={loading}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white rounded px-4 py-2 flex items-center justify-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-70"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google icon"
            className="w-5 h-5"
          />
          {isLogin ? "Log in with Google" : "Sign up with Google"}
        </button>
        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <a
            href={isLogin ? "/signup" : "/login"}
            className="text-blue-600 dark:text-blue-400 font-medium"
          >
            {isLogin ? "Sign up" : "Log in"}
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
