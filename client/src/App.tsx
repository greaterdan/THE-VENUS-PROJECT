import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiX, SiGithub } from "react-icons/si";
import { AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import PageTransition from "@/components/PageTransition";
import Home from "@/pages/Home";
import Contribute from "@/pages/Contribute";
import Manifesto from "@/pages/Manifesto";
import Structure from "@/pages/Structure";
import Agora from "@/pages/Agora";
import Contact from "@/pages/Contact";
import NFTs from "@/pages/NFTs";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={() => <PageTransition><Home /></PageTransition>} />
        <Route path="/contribute" component={() => <PageTransition><Contribute /></PageTransition>} />
        <Route path="/manifesto" component={() => <PageTransition><Manifesto /></PageTransition>} />
        <Route path="/structure" component={() => <PageTransition><Structure /></PageTransition>} />
        <Route path="/agora" component={() => <PageTransition><Agora /></PageTransition>} />
        <Route path="/contact" component={() => <PageTransition><Contact /></PageTransition>} />
        <Route path="/nfts" component={() => <PageTransition><NFTs /></PageTransition>} />
        <Route component={() => <PageTransition><NotFound /></PageTransition>} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-venus-bg text-foreground font-inter">
          <Navigation />
          <Router />
          
          {/* Fixed Social Icons - Bottom Right */}
          <div className="fixed bottom-6 right-6 flex flex-col space-y-3 z-50">
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
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
