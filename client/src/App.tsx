import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalConversationProvider } from "@/contexts/GlobalConversationContext";
import { SiX, SiGithub, SiInstagram, SiLinkedin, SiTiktok, SiYoutube } from "react-icons/si";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import Home from "@/pages/Home";
import Contribute from "@/pages/Contribute";
import Manifesto from "@/pages/Manifesto";
import Structure from "@/pages/Structure";
import Agora from "@/pages/Agora";
import AgoraChain from "@/pages/AgoraChain";
import Contact from "@/pages/Contact";
import NFTs from "@/pages/NFTs";
import NotFound from "@/pages/not-found";

function Router({ isLoaded, showContent }: { isLoaded: boolean; showContent: boolean }) {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={() => <PageTransition><Home isLoaded={isLoaded} showContent={showContent} /></PageTransition>} />
        <Route path="/contribute" component={() => <PageTransition><Contribute /></PageTransition>} />
        <Route path="/manifesto" component={() => <PageTransition><Manifesto /></PageTransition>} />
        <Route path="/structure" component={() => <PageTransition><Structure /></PageTransition>} />
        <Route path="/agora" component={() => <PageTransition><Agora /></PageTransition>} />
        <Route path="/agora-chain" component={() => <PageTransition><AgoraChain /></PageTransition>} />
        <Route path="/contact" component={() => <PageTransition><Contact /></PageTransition>} />
        <Route path="/nfts" component={() => <PageTransition><NFTs /></PageTransition>} />
        <Route component={() => <PageTransition><NotFound /></PageTransition>} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  const [isLoaded, setIsLoaded] = useState(true);
  const [showContent, setShowContent] = useState(true);
  const [showSocialButtons, setShowSocialButtons] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    // Show main title first
    const titleTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Then show background and other content AFTER title is visible
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1800);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(contentTimer);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          // Show social buttons when user scrolls down 50px or more
          setShowSocialButtons(scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GlobalConversationProvider>
          <div className="min-h-screen bg-venus-bg text-foreground font-inter">
          {/* Navigation - controlled by scroll position */}
          <Navigation />
          
          <Router isLoaded={isLoaded} showContent={showContent} />
          
          {/* Fixed Social Icons - Middle Right - Only on Home Page */}
          {location === '/' && (
            <div 
              className={`fixed top-1/2 right-6 transform -translate-y-1/2 flex flex-col space-y-3 z-50 transition-all duration-300 ease-in-out ${
                showSocialButtons ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
              }`}
            >
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-venus-lime transition-colors bg-white p-3 rounded-full shadow-lg hover:shadow-xl"
            >
              <SiX className="h-5 w-5" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-venus-lime transition-colors bg-white p-3 rounded-full shadow-lg hover:shadow-xl"
            >
              <SiGithub className="h-5 w-5" />
            </a>
            <a 
              href="https://www.instagram.com/thevenusproject/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-venus-lime transition-colors bg-white p-3 rounded-full shadow-lg hover:shadow-xl"
            >
              <SiInstagram className="h-5 w-5" />
            </a>
            <a 
              href="https://www.linkedin.com/company/the-venus-project/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-venus-lime transition-colors bg-white p-3 rounded-full shadow-lg hover:shadow-xl"
            >
              <SiLinkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://www.tiktok.com/@thevenusproject_rbe" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-venus-lime transition-colors bg-white p-3 rounded-full shadow-lg hover:shadow-xl"
            >
              <SiTiktok className="h-5 w-5" />
            </a>
            <a 
              href="https://www.youtube.com/channel/UCPNMR_iABvyFmc3G9i1r3Lw" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-black hover:text-venus-lime transition-colors bg-white p-3 rounded-full shadow-lg hover:shadow-xl"
            >
              <SiYoutube className="h-5 w-5" />
            </a>
            </div>
          )}
          </div>
          <Toaster />
        </GlobalConversationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
