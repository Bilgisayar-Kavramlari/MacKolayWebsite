import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import Home from "@/pages/home";
import Register from "@/pages/register";
import Login from "@/pages/login";
import Profile from "@/pages/profile";
import FindMatch from "@/pages/find-match";
import PostMatch from "@/pages/post-match";
import MyMatches from "@/pages/my-matches";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/kayit" component={Register} />
      <Route path="/giris" component={Login} />
      <Route path="/profil" component={Profile} />
      <Route path="/mac-bul" component={FindMatch} />
      <Route path="/mac-ilan-ver" component={PostMatch} />
      <Route path="/maclarim" component={MyMatches} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
