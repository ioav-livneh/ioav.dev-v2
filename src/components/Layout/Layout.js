import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import "./Layout.css";

const Layout = () => {
  /* -- Glow effect -- */
  useEffect(() => {
    const blob = document.getElementById("blob");

    const handlePointerMove = (event) => {
      const { clientX, clientY } = event;

      blob.animate(
        {
          left: `${clientX}px`,
          top: `${clientY}px`,
        },
        { duration: 3000, fill: "forwards" },
      );
    };

    window.onpointermove = handlePointerMove;
    return () => {
      window.onpointermove = null;
    };
  }, []);

  return (
    <div className="Layout">
      <div id="blob"></div>
      <div id="blur"></div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
