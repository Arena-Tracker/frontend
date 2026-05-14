import { Route } from "react-router-dom";
import FilterContent2 from "../pages/FilterContent2";
import { Box } from "@chakra-ui/react";
export const RoutesAlin = () => [
  // Ruta secundară care pleacă din /user/search -> /user/search/filter/:sportType
  <Route
    key="search-filter"
    path="search/filter/:sportType"
    element={<FilterContent2 />}
  />,
  
  <Route
    key="bookings"
    path="bookings"
    element={
      <Box p={10} color="white">
        Pagina Rezervări (Girip)
      </Box>
    }
  />,
];
