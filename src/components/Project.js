import React from "react";
import FlyEffect from "./FlyEffect";

function Project({ language }) {
  return (
    <section id="projects" style={{ position: "relative" }}>
      <h2>{language === "en" ? "My Projects" : "Dự án của tôi"}</h2>
      <FlyEffect containerId="projects" />
      {/* Add your projects content here */}
    </section>
  );
}

export default Project;
