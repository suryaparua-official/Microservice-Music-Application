import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
          <div className="flex flex-col items-center gap-4 text-center max-w-sm">
            <div className="w-12 h-12 rounded-full bg-red-600/10 flex items-center justify-center">
              <span className="text-red-400 text-xl font-bold">!</span>
            </div>
            <h1 className="text-white font-semibold text-lg">Something went wrong</h1>
            <p className="text-dim text-sm">{this.state.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-white text-black text-sm font-semibold
                         rounded-full hover:scale-[1.02] transition-transform duration-150"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
