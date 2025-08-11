import { useEffect, useState, useRef } from "react";
import ScrollPortrait from "@/components/ScrollPortrait";
import architectureBg from "@assets/a70b7a21-b96d-4213-a4f2-b2679bc99ce6-1_1754887244088.png";

// Media logos imports
import fhmLogo from "@assets/Untitled design (1) copy 2_1754926356755.png";
import digitLogo from "@assets/Untitled design (1) copy_1754926356755.png";
import rtLogo from "@assets/Untitled design (1)_1754926356755.png";
import aljazeeraLogo from "@assets/Untitled design copy 2_1754926356755.png";
import avroLogo from "@assets/Untitled design copy 3_1754926356755.png";
import atvLogo from "@assets/Untitled design copy 4_1754926356755.png";
import audibleLogo from "@assets/Untitled design copy 5_1754926356755.png";
import bbcWorldLogo from "@assets/Untitled design copy 6_1754926356755.png";
import bbcTwoLogo from "@assets/Untitled design copy 7_1754926356755.png";
import abGroupeLogo from "@assets/Untitled design copy 8_1754926356755.png";
import bloombergLogo from "@assets/Untitled design copy 9_1754926356755.png";
import cbsLogo from "@assets/Untitled design copy 10_1754926356755.png";
import viceLogo from "@assets/Untitled design copy 11_1754926356755.png";
import abcLogo from "@assets/Untitled design copy 12_1754926356755.png";
import fxLogo from "@assets/Untitled design copy 13_1754926356755.png";
import discoveryLogo from "@assets/Untitled design copy 14_1754926356755.png";
import bbcTwoAltLogo from "@assets/Untitled design copy_1754926356755.png";
import emLogo from "@assets/Untitled design_1754926356755.png";

interface HomeProps {
  isLoaded?: boolean;
  showContent?: boolean;
}

export default function Home({ isLoaded = true, showContent = true }: HomeProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - dragStart;
    setDragOffset(prev => prev + diff * 0.5);
    setDragStart(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const titleOpacity = Math.max(0, 1 - scrollY / 400);
  const titleScale = Math.max(0.8, 1 - scrollY / 1000);
  const titleTranslateY = -scrollY * 0.5;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden -mt-16 pt-16">
        {/* Multiple layer approach to handle PNG transparency */}
        <div 
          className={`absolute -top-16 left-0 right-0 bottom-0 bg-gray-100 transition-opacity duration-3000 ease-out delay-100 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>
        <div 
          className={`absolute -top-16 left-0 right-0 bottom-0 transition-opacity duration-3000 ease-out delay-400 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${architectureBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div 
          className={`absolute -top-16 left-0 right-0 bottom-0 bg-white bg-opacity-10 transition-opacity duration-3000 ease-out delay-700 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>
        
        <div className="text-center px-4 relative z-20">
          <h1 
            className={`text-6xl md:text-8xl font-bold text-black tracking-tight drop-shadow-lg transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{
              opacity: isLoaded ? titleOpacity : 0,
              transform: `translateY(${titleTranslateY}px) scale(${titleScale * (isLoaded ? 1 : 0.95)})`,
              textShadow: '2px 2px 4px rgba(255,255,255,0.8)'
            }}
          >
            THE VENUS PROJECT
          </h1>
        </div>
        
        {/* Gradient overlay for smooth transition */}
        <div 
          className={`absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-25 transition-opacity duration-3000 ease-out delay-1500 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            opacity: showContent ? Math.min(1, scrollY / 100) : 0
          }}
        />
        
        {/* Scroll indicator */}
        <div 
          className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 text-black animate-bounce z-20 transition-opacity duration-3000 ease-out delay-2000 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            opacity: showContent ? Math.max(0, 1 - scrollY / 200) : 0,
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
        className={`min-h-screen bg-white p-8 relative z-30 transition-all duration-3000 ease-out delay-800 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{
          transform: `translateY(${-scrollY * 0.1}px)`,
          backgroundColor: 'white',
          boxShadow: '0 -20px 40px rgba(255,255,255,0.9)'
        }}
      >
        <div 
          className="max-w-4xl mx-auto bg-white"
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
        
        {/* Portrait integrated in Vision section */}
        <ScrollPortrait />
      </div>
      
      {/* Featured In Section - Separate section */}
      <div 
        className={`bg-white py-16 transition-all duration-3000 ease-out delay-1500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-black mb-16">
            Featured In
          </h2>
        </div>
        
        {/* Scrolling logos container - full width */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing">
            <div 
              ref={scrollContainerRef}
              className={`flex ${isDragging ? '' : 'animate-scroll'} select-none`}
              style={{
                transform: `translateX(${dragOffset}px)`,
                animationPlayState: isDragging ? 'paused' : 'running'
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={(e) => !isDragging && (e.currentTarget.style.animationPlayState = 'paused')}
              onMouseOut={(e) => !isDragging && (e.currentTarget.style.animationPlayState = 'running')}
            >
              {/* First set of logos */}
              <div className="flex space-x-20 items-center min-w-max">
                <img src={fhmLogo} alt="FHM" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={digitLogo} alt="Digit" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={rtLogo} alt="RT" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={aljazeeraLogo} alt="Al Jazeera" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={avroLogo} alt="AVRO" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={atvLogo} alt="ATV" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={audibleLogo} alt="Audible" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={bbcWorldLogo} alt="BBC World News" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={bbcTwoLogo} alt="BBC Two" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={abGroupeLogo} alt="AB Groupe" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={bloombergLogo} alt="Bloomberg" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={cbsLogo} alt="CBS" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={viceLogo} alt="VICE" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={abcLogo} alt="ABC" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={fxLogo} alt="FX" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={discoveryLogo} alt="Discovery Channel" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={bbcTwoAltLogo} alt="BBC Two" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={emLogo} alt="EM" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              
              {/* Duplicate set for seamless loop */}
              <div className="flex space-x-20 items-center min-w-max ml-20">
                <img src={fhmLogo} alt="FHM" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={digitLogo} alt="Digit" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={rtLogo} alt="RT" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={aljazeeraLogo} alt="Al Jazeera" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={avroLogo} alt="AVRO" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={atvLogo} alt="ATV" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={audibleLogo} alt="Audible" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={bbcWorldLogo} alt="BBC World News" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={bbcTwoLogo} alt="BBC Two" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={abGroupeLogo} alt="AB Groupe" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={bloombergLogo} alt="Bloomberg" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={cbsLogo} alt="CBS" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={viceLogo} alt="VICE" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={abcLogo} alt="ABC" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={fxLogo} alt="FX" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={discoveryLogo} alt="Discovery Channel" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={bbcTwoAltLogo} alt="BBC Two" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
                <img src={emLogo} alt="EM" className="h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            </div>
          </div>
      </div>
    </>
  );
}
