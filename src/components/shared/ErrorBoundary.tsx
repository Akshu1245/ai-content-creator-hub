import { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
          <div className="bg-noise" />
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div
              className="absolute top-[30%] left-[50%] w-[500px] h-[500px] rounded-full blur-[150px] -translate-x-1/2"
              style={{ background: "radial-gradient(circle, hsl(0, 65%, 50%, 0.06), transparent 70%)" }}
            />
          </div>

          <div className="relative z-10 text-center px-6 max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground mb-2">
              An unexpected error occurred. Our team has been notified.
            </p>
            {this.state.error && (
              <p className="text-[10px] font-mono text-muted-foreground/60 bg-secondary/50 rounded-xl p-3 mb-6 text-left break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex items-center justify-center gap-3">
              <button onClick={this.handleReset} className="btn-primary text-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" /> Try Again
              </button>
              <a href="/">
                <button className="btn-ghost text-xs flex items-center gap-2">
                  <Home className="w-3.5 h-3.5" /> Home
                </button>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
