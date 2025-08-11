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
        <div className="fixed bottom-32 left-96 z-50 max-w-md">
          <div className="bg-white p-6 rounded-lg shadow-xl border-2 border-gray-200">
            <blockquote className="text-xl italic text-black mb-4 leading-relaxed">
              "{displayedQuote}"
              {isTypingQuote && <span className="animate-pulse text-lime-500">|</span>}
            </blockquote>
            <cite className="text-lg font-semibold text-gray-700">
              {displayedAuthor}
              {isTypingAuthor && <span className="animate-pulse text-lime-500">|</span>}
            </cite>
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollPortrait;