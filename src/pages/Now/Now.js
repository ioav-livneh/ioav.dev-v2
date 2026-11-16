import React, { useEffect } from "react";
import NowGoals from "../../components/NowGoals/NowGoals";
import NowReading from "../../components/NowReading/NowReading";
import NowListening from "../../components/NowListening/NowListening";
import Timeline from "../../components/Timeline/Timeline";
import "./Now.css";

const Now = () => {
  // Arriving from further down another page would otherwise keep that scroll position
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="Now">
      <header className="Now-intro">
        <p className="eyebrow">Now</p>
        <h1 className="Now-title">What I’m up to these days.</h1>
      </header>
      <div className="Now-columns">
        <NowGoals />
        <NowReading />
        <NowListening />
      </div>
      <Timeline />
    </div>
  );
};

export default Now;
