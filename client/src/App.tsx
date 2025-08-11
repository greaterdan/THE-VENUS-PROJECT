import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiX, SiGithub } from "react-icons/si";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import Contribute from "@/pages/Contribute";
import Manifesto from "@/pages/Manifesto";
import Structure from "@/pages/Structure";
import Agora from "@/pages/Agora";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/contribute" component={Contribute} />
      <Route path="/manifesto" component={Manifesto} />
      <Route path="/structure" component={Structure} />
      <Route path="/agora" component={Agora} />
      <Route component={NotFound} />
    </Switch>
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
