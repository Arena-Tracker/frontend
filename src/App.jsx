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
import FilterContent from "./pages/FilterContent";

function App() {
  // Aici ținem minte cine e logat (null = nimeni)
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Pagina de Login - trimitem funcția setUser ca să poată loga utilizatorul */}
        <Route path="/" element={<LoginPage onLogin={setUser} />} />

        {/* Rutele protejate: dacă nu ești logat cu rolul corect, te trimite la / */}
        <Route
          path="/user"
          element={
            user?.role === "user" ? (
              <UserPage user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/filter/:sportType" element={<FilterContent />} />
        {/* ... restul rutelor */}
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <AdminPage user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/bazasportiva"
          element={
            user?.role === "baza" ? (
              <BazaPage user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
