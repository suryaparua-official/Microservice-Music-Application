import { useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { FiX } from "react-icons/fi";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      {/* ── Desktop sidebar ────────────────────────── */}
      <div className="hidden lg:flex h-full py-2 pl-2">
        <Sidebar />
      </div>

      {/* ── Mobile sidebar overlay ─────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="relative w-64 h-full bg-[#0a0a0a] py-2 pl-2 shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-3 w-8 h-8 flex items-center justify-center
                         rounded-full bg-elevated text-dim hover:text-white
                         transition-colors duration-150"
              aria-label="Close menu"
            >
              <FiX size={15} />
            </button>
            <Sidebar />
          </div>
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* ── Main content ───────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Scrollable area — leaves room for fixed player (80px) */}
        <div className="flex-1 overflow-y-auto">
          <div className="bg-surface min-h-full mx-2 my-2 rounded-xl">
            {/* Sticky navbar */}
            <div className="sticky top-0 z-10 bg-surface/90 backdrop-blur-md
                            px-4 sm:px-6 pt-4 pb-3 rounded-t-xl">
              <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
            </div>

            {/* Page content */}
            <div className="px-4 sm:px-6 pb-8">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
