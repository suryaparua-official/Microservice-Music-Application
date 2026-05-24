import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/user/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import { useUserData } from "./context/user/UserContext";
import Loading from "./components/ui/Loading";
import { Album } from "./pages/user/Album";
import { PlayList } from "./pages/user/PlayList";
import { Admin } from "./pages/admin/Admin";

import Premium from "./pages/user/Premium";
import InstallApp from "./pages/user/InstallApp";
import Music from "./pages/user/Music";
import Podcast from "./pages/user/Podcast";
import Search from "./pages/user/Search";


const App = () => {
  const { isAuth, loading } = useUserData();

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* main pages */}
        <Route path="/" element={<Home />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/install" element={<InstallApp />} />
        <Route path="/music" element={<Music />} />
        <Route path="/podcasts" element={<Podcast />} />
        <Route path="/search" element={<Search />} />

        {/* album */}
        <Route path="/album/:id" element={<Album />} />

        {/* playlist (protected) */}
        <Route
          path="/playlist"
          element={isAuth ? <PlayList /> : <Login />}
        />

        {/* admin (protected) */}
        <Route
          path="/admin/dashboard"
          element={isAuth ? <Admin /> : <Login />}
        />

        {/* auth */}
        <Route
          path="/login"
          element={isAuth ? <Navigate to="/" replace /> : <Login />}
        />

        <Route
          path="/register"
          element={isAuth ? <Navigate to="/" replace /> : <Register />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
