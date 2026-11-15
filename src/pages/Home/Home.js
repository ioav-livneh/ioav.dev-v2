import React, { useEffect } from "react";
import Bio from "../../components/Bio/Bio";
import FeaturedProjects from "../../components/FeaturedProjects/FeaturedProjects";
import PrinciplesList from "../../components/PrinciplesList/PrinciplesList";
import ContactSection from "../../components/ContactSection/ContactSection";
import "./Home.css";

const Home = () => {
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
    <div className="Home">
      <div id="blob"></div>
      <div id="blur"></div>
      <Bio />
      <FeaturedProjects />
      <PrinciplesList />
      <ContactSection />
    </div>
  );
};

export default Home;
