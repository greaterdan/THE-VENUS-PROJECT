import { useState, useEffect } from "react";
import portraitImage from "@assets/Untitled design (3)_1754881967453.png";

const ScrollPortrait = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const opacity = Math.min(1, Math.max(0, (scrollY - 800) / 300));

  return (
    <div 
      className="fixed bottom-0 left-0 z-40 flex items-end"
      style={{ opacity }}
    >
      <img 
        src={portraitImage} 
        alt="Portrait" 
        className="object-cover transition-transform duration-300"
        style={{ width: '640px', height: '640px' }}
      />
      <div className="mb-16 max-w-sm" style={{ marginLeft: '-310px' }}>
        <blockquote className="text-lg italic text-black mb-4 leading-relaxed">
          "If we continue to use the same methods, we will get the same results."
        </blockquote>
        <cite className="text-base font-semibold text-black">
          — Jacque Fresco
        </cite>
      </div>
    </div>
  );
};

export default ScrollPortrait;