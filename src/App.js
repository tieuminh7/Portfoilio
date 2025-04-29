import React, { useState } from "react";
import Header from "./components/Header";
import About from "./components/About";
import Project from "./components/Project";
import Contact from "./components/Contact";
import Introduction from "./components/Introduction";

function App() {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "vi" : "en"));
  };

  return (
    <div className="App">
      <Header language={language} toggleLanguage={toggleLanguage} />
      <Introduction language={language} />
      <About language={language} />
      <Project language={language} />
      <Contact language={language} />
    </div>
  );
}

export default App;
