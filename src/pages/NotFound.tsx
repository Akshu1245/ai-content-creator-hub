import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="bg-noise" />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[30%] left-[50%] w-[500px] h-[500px] rounded-full blur-[150px] -translate-x-1/2"
          style={{ background: "radial-gradient(circle, hsl(12, 76%, 56%, 0.06), transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 text-center px-6">
        <div className="text-[120px] md:text-[180px] font-display font-bold leading-none text-muted/20 select-none mb-[-20px]">
          404
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/">
            <button className="btn-primary text-xs flex items-center gap-2">
              <Home className="w-3.5 h-3.5" /> Back to Home
            </button>
          </Link>
          <Link to="/dashboard">
            <button className="btn-ghost text-xs flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
