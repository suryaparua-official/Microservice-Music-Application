import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SongProvider } from "./context/song/SongContext.tsx";
import { UserProvider } from "./context/user/UserContext.tsx";
import Player from "./components/player/Player.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <UserProvider>
        <SongProvider>
          <ErrorBoundary>
            <App />
            <Player />
          </ErrorBoundary>
        </SongProvider>
      </UserProvider>
    </ErrorBoundary>
  </StrictMode>
);
