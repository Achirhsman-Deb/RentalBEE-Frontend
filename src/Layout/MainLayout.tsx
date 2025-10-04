import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import ScrollToTop from "../Misc/ScrollToTop";

const MainLayout: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="mt-[60px]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
