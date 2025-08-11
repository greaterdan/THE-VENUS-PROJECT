import { useState, useEffect } from "react";
import portraitImage from "@assets/Untitled design (1)_1754881134607.png";

const ScrollPortrait = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const fullText = "The future of sustainable cities lies in the harmony between artificial intelligence and human imagination. Every decision, every structure, every innovation must serve the collective good of humanity.";

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300); // Show after scrolling 300px
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setDisplayedText("");
      setCurrentIndex(0);
      return;
    }

    if (currentIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Typing speed: 50ms per character

      return () => clearTimeout(timer);
    }
  }, [isVisible, currentIndex, fullText]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-1/2 left-6 transform -translate-y-1/2 z-40 max-w-sm">
      <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 shadow-2xl border border-gray-800">
        {/* Portrait Image */}
        <div className="flex items-center mb-4">
          <img 
            src={portraitImage} 
            alt="Portrait" 
            className="w-16 h-16 rounded-full mr-4 object-cover animate-pulse"
          />
          <div className="text-white">
            <h3 className="font-bold text-lg">Visionary</h3>
            <p className="text-gray-400 text-sm">AI City Architect</p>
          </div>
        </div>
        
        {/* Self-writing text */}
        <div className="text-white text-sm leading-relaxed">
          {displayedText}
          <span className="animate-pulse">|</span>
        </div>
      </div>
    </div>
  );
};

export default ScrollPortrait;