import React from "react";
import { Outlet } from "react-router-dom";
import Banner from "../assets/Banner.png";

const AuthLayout: React.FC = () => {
  return (
    <main className="bg-[#FFFBF3] w-screen h-screen flex lg:overflow-auto short:overflow-auto">
    
      {/* Banner Section */}
      <div className="hidden lg:block short:hidden w-1/2 h-full overflow-hidden">
        <img
          className="w-full h-full object-cover object-center"
          src={Banner}
          alt="banner"
        />
      </div>

      {/* Form Section */}
      <div className="w-full lg:w-1/2 h-full flex justify-center items-center px-4 sm:px-6 md:px-8">
        <div className="w-full max-w-[480px]">
          <Outlet />
        </div>
      </div>

    </main>
  );
};

export default AuthLayout;
