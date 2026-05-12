import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { colors } from "./colors";
import { Navigation } from "../components/Navigation";

const UserPage = () => {
  return (
    <Box bg={colors.bgMain} minH="100vh">
      <Navigation />

      <Box
        ml={{ base: 0, md: "260px" }}
        pb={{ base: "80px", md: 10 }}
        pt={{ base: 6, md: 10 }}
        px={{ base: 4, md: 10, lg: 16 }}
      >
        {/* Aici se vor randa componentele HomeContent, SearchContent, etc. */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserPage;