import { Route } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import ProfileContent from "../pages/ProfileContent";
import BookingsContent from "../pages/BookingsContent";

export const RoutesGirip = () => [
  // Exemplu de rută secundară: /user/bookings/123
  <Route key="profile" path="profile" element={<ProfileContent />} />,

  <Route
    key="bookings"
    path="bookings"
    element={<BookingsContent />} 
  />,
];
