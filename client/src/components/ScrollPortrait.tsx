import { useState, useEffect } from "react";
import portraitImage from "@assets/You Don't Say _1754881435980.png";

const ScrollPortrait = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 200); // Show after scrolling 200px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 left-6 z-40">
      <img 
        src={portraitImage} 
        alt="Portrait" 
        className="w-32 h-32 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

export default ScrollPortrait;