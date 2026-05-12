// src/pages/BazaPage.jsx
import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { FiGrid, FiList, FiSettings } from "react-icons/fi";

import { colors } from "./colors";
import { Navigation } from "../components/Navigation";
import TerenuriManager from "./TerenuriManager";

// Meniul specific pentru Baza Sportivă
const BAZA_NAV_ITEMS = [
  { id: "terenuri", label: "Terenuri", icon: FiGrid },
  { id: "rezervari", label: "Rezervări", icon: FiList },
  { id: "profil", label: "Profil Bază", icon: FiSettings },
];

const BazaPage = () => {
  const [activeTab, setActiveTab] = useState("terenuri");

  const renderContent = () => {
    switch (activeTab) {
      case "terenuri":
        return <TerenuriManager />;
      case "rezervari":
        // Aici vom lega ulterior RezervariController (GET /rezervari/baza-sportiva/{id-baza})
        return (
          <Box color="white" p={10}>
            Pagină Rezervări (În lucru...)
          </Box>
        );
      case "profil":
        // Aici vom lega ulterior BazaSportivaController (PUT /api/baze-sportive/{id})
        return (
          <Box color="white" p={10}>
            Setări Profil Bază Sportivă (În lucru...)
          </Box>
        );
      default:
        return <TerenuriManager />;
    }
  };

  return (
    <Box
      bg={colors.bgMain}
      minH="100vh"
      fontFamily="'Plus Jakarta Sans', sans-serif"
    >
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        navItems={BAZA_NAV_ITEMS}
        title="Admin Bază." // Titlu specific in sidebar
      />

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

export default BazaPage;
