import React from "react";
import "./PrinciplesList.css";

const PrinciplesList = () => (
  <section id="ideas" className="PrinciplesList section">
    <div className="section-heading">
      <h2 className="section-title">Ideas I live by</h2>
    </div>
    <ol className="PrinciplesList-items">
      <li>
        <span className="PrinciplesList-number" aria-hidden="true">
          01
        </span>
        <h3>Be a mental marathoner.</h3>
        <p className="PrinciplesList-body">
          Cars made running 42 km unnecessary, yet people still run marathons
          because the effort is the point. AI is doing the same to thinking, and
          I want to be one of the people who keeps doing it anyway. Whether I’m
          writing or coding, I use AI for hints and sparring, not for handing me
          conclusions.
        </p>
        <p className="PrinciplesList-source">
          Term from David Brooks,{" "}
          <a href="#">“The People Who Will Thrive in the AI Age”</a>.
        </p>
      </li>
      <li>
        <span className="PrinciplesList-number" aria-hidden="true">
          02
        </span>
        <h3>Have a bias toward action.</h3>
        <p className="PrinciplesList-body">
          I’d rather ship something rough and let the real world show me what’s
          wrong than polish it in my head forever. Trying lots of things
          increases my surface area for luck. Most experiments fail; that’s the
          point. It’s also why I work in public: writing on{" "}
          <a href="https://ioav.blog">my blog</a> keeps me accountable.
        </p>
        <p className="PrinciplesList-source">
          Inspired by <em>Tiny Experiments</em> and <em>Show Your Work!</em>
        </p>
      </li>
      <li>
        <span className="PrinciplesList-number" aria-hidden="true">
          03
        </span>
        <h3>Seek real feedback.</h3>
        <p className="PrinciplesList-body">
          The people around me often see my flaws more clearly than I do, but
          rarely say so because it’s uncomfortable. Anonymity removes that
          discomfort, so if you have something honest to tell me,{" "}
          <a href="#">leave me anonymous feedback</a>.
        </p>
        <p className="PrinciplesList-source">
          From Cate Hall’s <em>You Can Just Do Things</em>.
        </p>
      </li>
    </ol>
  </section>
);

export default PrinciplesList;
