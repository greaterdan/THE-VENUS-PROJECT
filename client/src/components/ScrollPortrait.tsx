import { useState, useEffect } from "react";
import portraitImage from "@assets/Untitled design (3)_1754881967453.png";

const ScrollPortrait = () => {
  const [scrollY, setScrollY] = useState(0);
  const [displayedQuote, setDisplayedQuote] = useState("");
  const [displayedAuthor, setDisplayedAuthor] = useState("");
  const [isTypingQuote, setIsTypingQuote] = useState(false);
  const [isTypingAuthor, setIsTypingAuthor] = useState(false);

  const fullQuote = "If we continue to use the same methods, we will get the same results.";
  const fullAuthor = "— Jacque Fresco";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const portraitOpacity = Math.min(1, Math.max(0, (scrollY - 800) / 200));
  const shouldShowQuote = scrollY > 800;

  useEffect(() => {
    const shouldStartTyping = scrollY > 800;
    
    if (!shouldStartTyping) {
      setDisplayedQuote("");
      setDisplayedAuthor("");
      setIsTypingQuote(false);
      setIsTypingAuthor(false);
      return;
    }

    if (!isTypingQuote && displayedQuote.length < fullQuote.length) {
      setIsTypingQuote(true);
      const timer = setTimeout(() => {
        setDisplayedQuote(prev => prev + fullQuote[prev.length]);
        setIsTypingQuote(false);
      }, 50);
      return () => clearTimeout(timer);
    } else if (displayedQuote === fullQuote && !isTypingAuthor && displayedAuthor.length < fullAuthor.length) {
      setIsTypingAuthor(true);
      const timer = setTimeout(() => {
        setDisplayedAuthor(prev => prev + fullAuthor[prev.length]);
        setIsTypingAuthor(false);
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [scrollY, displayedQuote, displayedAuthor, isTypingQuote, isTypingAuthor, fullQuote, fullAuthor]);

  return (
    <>
      {/* Portrait */}
      <div 
        className="fixed bottom-0 left-0 z-40"
        style={{ opacity: portraitOpacity }}
      >
        <img 
          src={portraitImage} 
          alt="Portrait" 
          className="object-cover transition-transform duration-300"
          style={{ width: '640px', height: '640px' }}
        />
      </div>
      
      {/* Quote */}
      {shouldShowQuote && (
        <div className="fixed bottom-16 left-80 z-50 max-w-sm">
          <blockquote className="text-lg italic text-black mb-4 leading-relaxed bg-white/90 p-4 rounded-lg shadow-lg">
            "{displayedQuote}"
            {isTypingQuote && <span className="animate-pulse">|</span>}
          </blockquote>
          <cite className="text-base font-semibold text-black bg-white/90 px-4 py-2 rounded">
            {displayedAuthor}
            {isTypingAuthor && <span className="animate-pulse">|</span>}
          </cite>
        </div>
      )}
    </>
  );
};

export default ScrollPortrait;