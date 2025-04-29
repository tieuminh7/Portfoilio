import React, { useState, useEffect, useRef } from "react";
import "../styles/Introduction.css";
import "../styles/TypingCursor.css";
import ImageParticleEffect from "./ImageParticleEffect";
import bGosell from "../Images/Banner/b-gosell.png";
import bMediastep from "../Images/Banner/b-mediastep.png";

const bannerImages = [bGosell, bMediastep];

function Introduction({ language }) {
  const staticPrefix = language === "en" ? "I'm a " : "Tôi là ";
  const dynamicTexts =
    language === "en"
      ? ["full-stack developer", "business consultant", "content creator"]
      : ["lập trình viên", "chuyên viên tư vấn", "nhà sáng tạo nội dung"];

  const greeting = language === "en" ? "Hello," : "Xin chào,";
  const welcome =
    language === "en" ? "I'm Tyler Quach" : "Tôi là Quách Tiểu Minh";

  const [displayedText, setDisplayedText] = useState("");
  const [dynamicIndex, setDynamicIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const introductionImageRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      if (introductionImageRef.current) {
        const { clientWidth, clientHeight } = introductionImageRef.current;
        setCanvasSize({ width: clientWidth, height: clientHeight });
      }
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    let timeout;
    const currentText = dynamicTexts[dynamicIndex];
    const fullText = staticPrefix + currentText;

    if (!isDeleting && charIndex <= fullText.length) {
      timeout = setTimeout(() => {
        setDisplayedText(fullText.substring(0, charIndex));
        setCharIndex(charIndex + 1);
      }, 50);
    } else if (isDeleting && charIndex >= staticPrefix.length) {
      timeout = setTimeout(() => {
        setDisplayedText(fullText.substring(0, charIndex));
        setCharIndex(charIndex - 1);
      }, 25);
    } else if (!isDeleting && charIndex > fullText.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
        setCharIndex(charIndex - 1);
      }, 2000);
    } else if (isDeleting && charIndex < staticPrefix.length) {
      setIsDeleting(false);
      setDynamicIndex((dynamicIndex + 1) % dynamicTexts.length);
      setCharIndex(staticPrefix.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, dynamicIndex, staticPrefix, dynamicTexts]);

  // Add handler for cycle complete from ImageParticleEffect
  const handleCycleComplete = () => {
    // Do nothing to prevent cycling to next image
  };

  return (
    <section
      id="introduction"
      className="introduction-section"
      style={{ position: "relative" }}
    >
      <div className="introduction-content" style={{ position: "relative" }}>
        <div
          className="introduction-text"
          style={{ position: "relative", zIndex: 2 }}
        >
          <p>{greeting}</p>
          <p>{welcome}</p>
          <p>
            {displayedText}
            <span className="typed-cursor typed-cursor--blink">|</span>
          </p>
        </div>
        <div
          className="introduction-image"
          ref={introductionImageRef}
          style={{ position: "relative" }}
        >
          {canvasSize.width > 0 && canvasSize.height > 0 && (
            <ImageParticleEffect
              imageSrc={bannerImages[currentImageIndex]}
              width={canvasSize.width}
              height={canvasSize.height}
              particleSize={5}
              displayDuration={2000}
              className="responsive-canvas"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default Introduction;
