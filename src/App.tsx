import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BrandsPage from "./pages/BrandsPage";
import PhoneFinderPage from "./pages/PhoneFinderPage";
import PhoneDetailPage from "./pages/PhoneDetailPage";
import ComparePage from "./pages/ComparePage";
import NewsPage from "./pages/NewsPage";
import UpcomingPage from "./pages/UpcomingPage";
import TopPhonesPage from "./pages/TopPhonesPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/phone-finder" element={<PhoneFinderPage />} />
            <Route path="/phone/:id" element={<PhoneDetailPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/upcoming" element={<UpcomingPage />} />
            <Route path="/top-10" element={<TopPhonesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
