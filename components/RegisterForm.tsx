import React, { useState, type ChangeEvent, type FormEvent } from "react";

type RegisterFormProps = {
  isLogin?: boolean;
  isLoading?: boolean;
  onSubmit?: (formData: FormData) => void;
  onGoogleSignIn?: () => Promise<void>;
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
  isLoading = false,
  onSubmit,
  onGoogleSignIn,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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

  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-1">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
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
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
              />
            </>
          )}
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={isLogin ? "Password" : "Create Password"}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded px-4 py-2 font-semibold flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div
                  className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"
                  role="status"
                  aria-label="loading"
                />
                <span className="ml-2">Please wait...</span>
              </>
            ) : (
              <span>{isLogin ? "Log In" : "Create Account"}</span>
            )}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button
          type="button"
          onClick={async () => {
            if (onGoogleSignIn) await onGoogleSignIn();
          }}
          className="w-full border border-gray-300 rounded px-4 py-2 flex items-center justify-center gap-2"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google icon"
            className="w-5 h-5"
          />
          {isLogin ? "Log in with Google" : "Sign up with Google"}
        </button>

        <p className="mt-6 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <a
            href={isLogin ? "/signup" : "/login"}
            className="text-blue-600 font-medium"
          >
            {isLogin ? "Sign up" : "Log in"}
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
