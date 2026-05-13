// src/pages/BazaPage.jsx
import React from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom"; // Importăm Outlet pentru sub-rute
import { FiGrid, FiList, FiSettings } from "react-icons/fi";
import { colors } from "./colors";
import { Navigation } from "../components/Navigation";

// Definim meniul specific pentru Baza Sportivă
const BAZA_NAV_ITEMS = [
  { id: "terenuri", label: "Terenuri", icon: FiGrid },
  { id: "rezervari", label: "Rezervări", icon: FiList },
  { id: "profil", label: "Profil Bază", icon: FiSettings },
];

const BazaPage = () => {
  return (
    <Box
      bg={colors.bgMain}
      minH="100vh"
      fontFamily="'Plus Jakarta Sans', sans-serif"
    >
      {/* Îi transmitem lui Navigation basePath="/baza" ca să știe unde să trimită click-urile */}
      <Navigation
        navItems={BAZA_NAV_ITEMS}
        basePath="/baza"
        title="SportApp."
      />

      <Box
        ml={{ base: 0, md: "260px" }}
        pb={{ base: "80px", md: 10 }}
        pt={{ base: 6, md: 10 }}
        px={{ base: 4, md: 10, lg: 16 }}
      >
        {/* Aici se vor randa componentele corespunzătoare sub-rutelor (/baza/terenuri, etc.) */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default BazaPage;
