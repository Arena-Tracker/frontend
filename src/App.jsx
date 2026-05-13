import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import BazaPage from "./pages/BazaPage";
import HomeContent from "./pages/HomeContent";
import SearchContent from "./pages/SearchContent";
import FilterContent from "./pages/FilterContent";
import { Box } from "@chakra-ui/react";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={setUser} />} />

        {/* Ruta parinte pentru User */}
        <Route
          path="/user"
          element={
            user?.role === "user" ? <UserPage user={user} /> : <Navigate to="/" />
          }
        >
          {/* Rutele interioare care se vor incarca in Outlet */}
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeContent />} />
          <Route path="search" element={<SearchContent />} />
          <Route path="search/filter/:sportType" element={<FilterContent />} />
          <Route path="bookings" element={<Box color="white" p={10}>Pagina Rezervări</Box>} />
          <Route path="profile" element={<Box color="white" p={10}>Pagina Profil</Box>} />
        </Route>

        <Route
          path="/admin"
          element={user?.role === "admin" ? <AdminPage user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/bazasportiva"
          element={user?.role === "baza" ? <BazaPage user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;