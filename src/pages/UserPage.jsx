import React, { useState } from "react";
import { Box } from "@chakra-ui/react";

// Importuri adaptate
import { colors } from "./colors";
import { Navigation } from "../components/Navigation";
import HomeContent from "./HomeContent";
import SearchContent from "./SearchContent"; // <-- Importul nou

const UserPage = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeContent />;
      case "search":
        return <SearchContent />; // <-- Apelul componentei noi
      case "bookings":
        return (
          <Box color="white" p={10}>
            Pagina Rezervări (În lucru...)
          </Box>
        );
      case "profile":
        return (
          <Box color="white" p={10}>
            Pagina Profil (În lucru...)
          </Box>
        );
      default:
        return <HomeContent />;
    }
  };

  return (
    <Box
      bg={colors.bgMain}
      minH="100vh"
      fontFamily="'Plus Jakarta Sans', sans-serif"
    >
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <Box
        ml={{ base: 0, md: "260px" }}
        pb={{ base: "80px", md: 10 }}
        pt={{ base: 6, md: 10 }}
        px={{ base: 4, md: 10, lg: 16 }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default UserPage;