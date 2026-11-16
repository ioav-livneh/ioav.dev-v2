import React from "react";
import { goals } from "../../pages/Now/nowData";

const GoalList = ({ title, items }) => (
  <div className="Now-goal-group">
    <h3 className="Now-subtitle">{title}</h3>
    <ul className="Now-goals">
      {items.map((goal) => (
        <li key={goal}>{goal}</li>
      ))}
    </ul>
  </div>
);

// Column 1: what I'm working towards
const NowGoals = () => (
  <section className="Now-column" aria-labelledby="now-goals">
    <h2 className="Now-column-title" id="now-goals">
      Goals
    </h2>
    <GoalList title="This quarter" items={goals.quarter} />
    <GoalList title="Long term" items={goals.longTerm} />
  </section>
);

export default NowGoals;
