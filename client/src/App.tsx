import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Discover from "@/pages/Discover";
import Matches from "@/pages/Matches";
import { useState } from "react";

// Create global context for the username
import { createContext } from "react";

export const UserContext = createContext({
  username: "user",
  setUsername: (username: string) => {}
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Discover} />
      <Route path="/matches" component={Matches} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // In a real app, this would come from authentication
  const [username, setUsername] = useState("user");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserContext.Provider value={{ username, setUsername }}>
          <Toaster />
          <Router />
        </UserContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
