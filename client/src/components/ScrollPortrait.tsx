import { useState, useEffect } from "react";
import portraitImage from "@assets/Untitled design (3)_1754881967453.png";

const ScrollPortrait = () => {
  const [scrollY, setScrollY] = useState(0);
  const [displayedQuote, setDisplayedQuote] = useState("");
  const [displayedAuthor, setDisplayedAuthor] = useState("");
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const fullQuote = "If we continue to use the same methods, we will get the same results.";
  const fullAuthor = "— Jacque Fresco";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const portraitOpacity = Math.min(1, Math.max(0, (scrollY - 800) / 200));
  const shouldShowQuote = scrollY > 800;

  // Start typing animation once when scroll threshold is reached
  useEffect(() => {
    if (scrollY > 800 && !hasStartedTyping) {
      setHasStartedTyping(true);
    } else if (scrollY <= 400) {
      // Reset when scrolling back up significantly
      setHasStartedTyping(false);
      setDisplayedQuote("");
      setDisplayedAuthor("");
    }
  }, [scrollY, hasStartedTyping]);

  // Handle quote typing
  useEffect(() => {
    if (!hasStartedTyping || displayedQuote.length >= fullQuote.length) return;
    
    const timer = setTimeout(() => {
      setDisplayedQuote(fullQuote.substring(0, displayedQuote.length + 1));
    }, 50);
    
    return () => clearTimeout(timer);
  }, [displayedQuote, hasStartedTyping, fullQuote]);

  // Handle author typing (starts after quote is complete)
  useEffect(() => {
    if (!hasStartedTyping || displayedQuote.length < fullQuote.length || displayedAuthor.length >= fullAuthor.length) return;
    
    const timer = setTimeout(() => {
      setDisplayedAuthor(fullAuthor.substring(0, displayedAuthor.length + 1));
    }, 80);
    
    return () => clearTimeout(timer);
  }, [displayedQuote, displayedAuthor, hasStartedTyping, fullQuote, fullAuthor]);

  return (
    <>
      {/* Portrait - hidden on smaller screens */}
      <div 
        className="fixed bottom-0 left-0 z-40 hidden lg:block"
        style={{ opacity: portraitOpacity }}
      >
        <img 
          src={portraitImage} 
          alt="Portrait" 
          className="object-cover transition-transform duration-300"
          style={{ width: '640px', height: '640px' }}
        />
      </div>
      
      {/* Quote - hidden on smaller screens */}
      {shouldShowQuote && (
        <div className="fixed bottom-32 left-80 z-50 max-w-md hidden lg:block">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <blockquote className="text-xl italic text-black mb-4 leading-relaxed">
              "{displayedQuote}"
              {hasStartedTyping && displayedQuote.length < fullQuote.length && (
                <span className="animate-pulse text-lime-500">|</span>
              )}
            </blockquote>
            <cite className="text-lg font-semibold text-gray-700">
              {displayedAuthor}
              {hasStartedTyping && displayedQuote.length === fullQuote.length && displayedAuthor.length < fullAuthor.length && (
                <span className="animate-pulse text-lime-500">|</span>
              )}
            </cite>
          </div>
        </div>
      )}
    </>
  );
};

export default ScrollPortrait;