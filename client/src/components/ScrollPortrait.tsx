import { useState, useEffect } from "react";
import portraitImage from "@assets/Untitled design (2)_1754881780219.png";

const ScrollPortrait = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = Math.min(1, Math.max(0, (scrollY - 200) / 300));

  return (
    <div 
      className="fixed bottom-20 left-6 z-40"
      style={{ opacity }}
    >
      <img 
        src={portraitImage} 
        alt="Portrait" 
        className="w-64 h-64 object-cover transition-transform duration-300"
      />
    </div>
  );
};

export default ScrollPortrait;