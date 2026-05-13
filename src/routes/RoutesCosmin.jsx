import { Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export const RoutesCosmin = () => [
  // Exemplu de rută secundară: /baza/terenuri/adauga
  <Route
    key="teren-add"
    path="terenuri/adauga"
    element={<Box p={10}>Formular Adăugare Teren</Box>}
  />,
];
