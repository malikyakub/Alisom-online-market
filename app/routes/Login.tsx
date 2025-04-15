import RegisterForm from "components/RegisterForm";
import React from "react";
import LoginIllustrator from "../../public/assets/images/Login-illustrator.png";

export function meta() {
  return [{ title: "Alisom Online market - Login" }];
}

const Login: React.FC = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Login form submitted");
  };

  return (
    <div className="min-h-screen p-5 flex flex-col gap-10 justify-center items-center">
      <div className="flex flex-col lg:flex-row justify-between items-center px-5 w-full max-w-7xl">
        <div className="w-full lg:w-1/2 overflow-hidden hidden lg:block">
          <img src={LoginIllustrator} alt="login illustrator" />
        </div>

        <div className="w-full lg:w-1/2">
          <RegisterForm isLogin={true} />
        </div>
      </div>
    </div>
  );
};

export default Login;
