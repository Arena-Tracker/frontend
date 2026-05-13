// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import { Box } from "@chakra-ui/react";

// Pagini principale
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import BazaPage from "./pages/BazaPage";

// Componente de conținut
import HomeContent from "./pages/HomeContent";
import SearchContent from "./pages/SearchContent";
import TerenuriManager from "./pages/TerenuriManager";

// Importul fișierelor de rute ale echipei
import { RoutesAlin } from "./routes/RoutesAlin";
import { RoutesGirip } from "./routes/RoutesGirip";
import { RoutesCosmin } from "./routes/RoutesCosmin";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={setUser} />} />

        {/* ZONA UTILIZATOR (Alin & Girip) */}
        <Route
          path="/user"
          element={user?.role === "user" ? <UserPage /> : <Navigate to="/" />}
        >
          <Route index element={<Navigate to="home" replace />} />

          <Route path="home" element={<HomeContent />} />
          <Route path="search" element={<SearchContent />} />

          {/* Aici vin automat Bookings si Profile din fisierul lui Girip */}
          {RoutesGirip()}
          {RoutesAlin()}
        </Route>
        {/* ZONA BAZĂ SPORTIVĂ (Cosmin) */}
        <Route
          path="/baza"
          element={user?.role === "baza" ? <BazaPage /> : <Navigate to="/" />}
        >
          <Route index element={<Navigate to="terenuri" replace />} />
          <Route path="terenuri" element={<TerenuriManager />} />

          {/* Rutele tale secundare sunt injectate aici */}
          {RoutesCosmin()}
        </Route>

        <Route
          path="/admin"
          element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
