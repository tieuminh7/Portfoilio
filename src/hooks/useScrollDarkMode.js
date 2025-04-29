import { useState, useEffect } from "react";

function useScrollDarkMode(threshold = 50, tolerance = 5) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (Math.abs(currentScrollY - lastScrollY) > tolerance) {
            setIsDark(currentScrollY > threshold);
            lastScrollY = currentScrollY;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold, tolerance]);

  return isDark;
}

export default useScrollDarkMode;
