import React from "react";

function About({ language }) {
  const aboutText =
    language === "en"
      ? "I am a passionate developer with experience in building web applications."
      : "Tôi là một lập trình viên đam mê với kinh nghiệm xây dựng các ứng dụng web.";

  return (
    <section id="about-section" className="about-section">
      <h2>{language === "en" ? "About Me" : "Về Tôi"}</h2>
      <p>{aboutText}</p>
    </section>
  );
}

export default About;
