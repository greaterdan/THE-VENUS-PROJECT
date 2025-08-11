import { useEffect, useState } from "react";
import ScrollPortrait from "@/components/ScrollPortrait";
import architectureBg from "@assets/fd7aa77a-6cf8-41b7-a61c-a2ea33400e8e_1754886580779.png";

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const paragraphText = "Cities have always been the product of human imagination and human limitation, shaped by the slow accumulation of decisions made by countless individuals over generations. But what if we could reimagine this process entirely?";

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const shouldStartTyping = scrollY > 400;
    setIsTyping(shouldStartTyping);
  }, [scrollY]);

  const titleOpacity = Math.max(0, 1 - scrollY / 400);
  const titleScale = Math.max(0.8, 1 - scrollY / 1000);
  const titleTranslateY = -scrollY * 0.5;

  return (
    <>
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), url(${architectureBg}) center/cover no-repeat, #ffffff`
        }}
      >
        
        <div className="text-center px-4 relative z-10">
          <h1 
            className="text-6xl md:text-8xl font-bold text-black tracking-tight transition-all duration-300 drop-shadow-lg"
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleTranslateY}px) scale(${titleScale})`,
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            THE VENUS PROJECT
          </h1>
        </div>
        
        {/* Gradient overlay for smooth transition */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none"
          style={{
            opacity: Math.min(1, scrollY / 200)
          }}
        />
        
        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-black animate-bounce relative z-10"
          style={{
            opacity: Math.max(0, 1 - scrollY / 200),
            textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll to explore</span>
            <div className="w-px h-8 bg-black shadow-lg"></div>
          </div>
        </div>
      </div>
      
      {/* Transition section */}
      <div 
        className="min-h-screen bg-white p-8 relative"
        style={{
          transform: `translateY(${-scrollY * 0.1}px)`,
        }}
      >
        <div 
          className="max-w-4xl mx-auto"
          style={{
            opacity: Math.min(1, Math.max(0, (scrollY - 200) / 300)),
            transform: `translateY(${Math.max(0, 100 - (scrollY - 200) * 0.3)}px)`,
          }}
        >
          <h2 className={`text-4xl font-bold text-black mb-8 ${isTyping ? "fade-in-up" : ""}`}>
            Vision for Tomorrow
          </h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p className={isTyping ? "fade-in-up" : ""} style={{ animationDelay: "0.2s" }}>
              Cities have always been the product of human imagination and human limitation, shaped by the slow 
              accumulation of decisions made by countless individuals over generations. But what if we could 
              reimagine this process entirely?
            </p>
            <p className={isTyping ? "fade-in-up" : ""} style={{ animationDelay: "0.4s" }}>
              The Venus Project represents a new paradigm in urban development, where artificial intelligence 
              and human creativity converge to create sustainable, efficient, and beautiful living spaces 
              that serve all of humanity.
            </p>
            <p className={isTyping ? "fade-in-up" : ""} style={{ animationDelay: "0.6s" }}>
              Through advanced AI systems and distributed computing, we're building the foundation for cities 
              that adapt, learn, and evolve with their inhabitants, creating harmony between technology and nature.
            </p>
            <p className={isTyping ? "fade-in-up" : ""} style={{ animationDelay: "0.8s" }}>
              Join us in this revolutionary journey toward a sustainable future where every citizen thrives 
              in an environment designed for both individual fulfillment and collective prosperity.
            </p>
          </div>
        </div>
      </div>
      
      <ScrollPortrait />
    </>
  );
}
