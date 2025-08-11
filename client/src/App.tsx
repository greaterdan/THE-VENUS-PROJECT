import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
