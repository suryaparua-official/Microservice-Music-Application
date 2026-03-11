import { useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  console.log("USER API:", import.meta.env.VITE_USER_SERVER_URL);
console.log("SONG API:", import.meta.env.VITE_SONG_SERVER_URL);
console.log("ADMIN API:", import.meta.env.VITE_ADMIN_SERVER_URL);


  return (
    <div className="min-h-screen flex overflow-hidden">
      
      {/* ===== Desktop Sidebar ===== */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* ===== Mobile Sidebar ===== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          
          {/* sidebar (left side) */}
          <div className="w-72 bg-[#121212] h-full p-3 relative">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-3 right-3 text-white text-xl
                         w-8 h-8 flex items-center justify-center
                         rounded-full bg-black hover:bg-[#1a1a1a]"
            >
              ✕
            </button>
            <Sidebar />
          </div>

          {/* backdrop */}
          <div
            className="flex-1 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* ===== Main Content ===== */}
      <div className="flex-1 flex flex-col bg-[#121212] text-white">
        
        {/* Navbar */}
        <div className="shrink-0 px-3 sm:px-6 pt-3 sm:pt-4">
          <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
        </div>

        {/* Scrollable content */}
        <div
          className="
            flex-1 overflow-y-auto
            px-3 sm:px-6
            pb-24 sm:pb-6     /* 🔑 mobile-এ player এর জায়গা */
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
