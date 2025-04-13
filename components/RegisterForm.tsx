import React from "react";

const RegisterForm = ({ isLogin = false }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full lg:max-w-md">
        <h2 className="text-2xl font-bold mb-1">
          {isLogin ? "Welcome back" : "Create an account"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isLogin
            ? "Enter your credentials to login"
            : "Enter your details below"}
        </p>

        <form className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
              />
            </>
          )}
          <input
            type="text"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
          />
          <input
            type="password"
            placeholder={isLogin ? "Password" : "Create Password"}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:bg-blue-100 focus:border-[#007BFF]"
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded px-4 py-2 font-semibold"
          >
            {isLogin ? "Log In" : "Create Account"}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button className="w-full border border-gray-300 rounded px-4 py-2 flex items-center justify-center gap-2">
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
