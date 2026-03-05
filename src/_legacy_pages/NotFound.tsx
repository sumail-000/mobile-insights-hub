import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, Smartphone, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen page-bg">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-24">
        <div className="glass-card rounded-2xl p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Smartphone size={36} className="text-primary opacity-70" />
          </div>
          <h1 className="text-7xl font-black text-primary mb-2">404</h1>
          <h2 className="text-xl font-bold mb-2">Page Not Found</h2>
          <p className="text-sm text-muted-foreground mb-8">
            The page <span className="font-mono text-xs bg-white/50 px-2 py-0.5 rounded border border-border/50">{location.pathname}</span> doesn't exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg"
            >
              <Home size={15} />
              Go Home
            </Link>
            <Link
              to="/phone-finder"
              className="flex items-center justify-center gap-2 glass-card px-6 py-2.5 rounded-xl font-bold text-sm hover:border-primary/50 transition-all"
            >
              <Search size={15} className="text-primary" />
              Find a Phone
            </Link>
          </div>
          <button
            onClick={() => window.history.back()}
            className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mx-auto"
          >
            <ArrowLeft size={12} />
            Go back
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
