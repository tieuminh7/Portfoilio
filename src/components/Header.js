import React from "react";
import EnFlag from "../Images/En.jpg";
import ViFlag from "../Images/Vi.webp";
import useScrollDarkMode from "../hooks/useScrollDarkMode";
import "../styles/Header.css";

function Header({ language, toggleLanguage }) {
  const isDark = useScrollDarkMode();

  return (
    <header className={`header ${isDark ? "dark" : ""}`}>
      <nav className="nav">
        <a href="#about" className="nav-link">
          {language === "en" ? "About" : "Giới thiệu"}
        </a>
        <a href="#projects" className="nav-link">
          {language === "en" ? "Projects" : "Dự án"}
        </a>
        <a href="#contact" className="nav-link">
          {language === "en" ? "Contact" : "Liên hệ"}
        </a>
      </nav>
      <button onClick={toggleLanguage} className="lang-toggle-button">
        <img
          src={language === "en" ? ViFlag : EnFlag}
          alt={language === "en" ? "Vietnamese" : "English"}
          className="flag-icon"
        />
      </button>
    </header>
  );
}

export default Header;
