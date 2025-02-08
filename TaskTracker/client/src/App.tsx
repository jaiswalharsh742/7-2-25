import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";

// Lazy load components
const Home = lazy(() => import("@/pages/home"));
const Notifications = lazy(() => import("@/components/Notifications"));

function Router() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">Loading...</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Suspense fallback={null}>
        <Notifications />
      </Suspense>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;