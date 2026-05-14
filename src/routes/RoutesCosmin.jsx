import { Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import RezervariBaza from "../pages/RezervariBaza";
import ProfilBaza from "../pages/ProfilBaza";
export const RoutesCosmin = () => [
  // Exemplu de rută secundară: /baza/terenuri/adauga
  <Route
    key="teren-add"
    path="terenuri/adauga"
    element={<Box p={10}>Formular Adăugare Teren</Box>}
  />,
  // Aici legăm pagina proaspăt creată:
  <Route key="rezervari-baza" path="rezervari" element={<RezervariBaza />} />,

  <Route key="profil-baza" path="profil" element={<ProfilBaza />} />,
];
