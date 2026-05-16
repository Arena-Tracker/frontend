// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { getCurrentUser } from "./utils/auth"; // <--- Importăm utilitarul nostru smart!

import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import BazaPage from "./pages/BazaPage";
import HomeContent2 from "./pages/HomeContent2";
import SearchContent2 from "./pages/SearchContent2";
import TerenuriManager from "./pages/TerenuriManager";

import { RoutesAlin } from "./routes/RoutesAlin";
import { RoutesGirip } from "./routes/RoutesGirip";
import { RoutesCosmin } from "./routes/RoutesCosmin";

function App() {
  const [user, setUser] = useState(null);

  // Rehidratare smart la Refresh
  useEffect(() => {
    const loggedInUser = getCurrentUser();
    if (loggedInUser) {
      setUser({ id: loggedInUser.id, role: loggedInUser.role });
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={setUser} />} />

        {/* ZONA UTILIZATOR */}
        <Route
          path="/user"
          element={user?.role === "USER" ? <UserPage /> : <Navigate to="/" />}
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeContent2 />} />
          <Route path="search" element={<SearchContent2 />} />
          {RoutesGirip()}
          {RoutesAlin()}
        </Route>

        {/* ZONA BAZĂ SPORTIVĂ */}
        <Route
          path="/baza"
          element={
            user?.role === "BAZA_SPORTIVA" || user?.role === "ADMIN" ? (
              <BazaPage />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route index element={<Navigate to="terenuri" replace />} />
          <Route path="terenuri" element={<TerenuriManager />} />
          {RoutesCosmin()}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
