// src/pages/UserPage.jsx
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { colors } from "./colors";
import { Navigation } from "../components/Navigation";
import { FiCalendar, FiHome, FiSearch, FiUser } from "react-icons/fi";

// 1. Definim meniul specific pentru rolul de UTILIZATOR
const NAV_ITEMS_USER = [
  { id: "home", label: "Acasă", icon: FiHome },
  { id: "search", label: "Caută", icon: FiSearch },
  { id: "bookings", label: "Rezervări", icon: FiCalendar },
  { id: "profile", label: "Profil", icon: FiUser },
];

const UserPage = () => {
  return (
    <Box
      bg={colors.bgMain}
      minH="100vh"
      fontFamily="'Plus Jakarta Sans', sans-serif"
    >
      {/* 2. Inserăm meniul, îi transmitem butoanele și calea de bază */}
      <Navigation
        navItems={NAV_ITEMS_USER}
        basePath="/user"
        title="ArenaTracker."
      />

      {/* 3. Aici se vor randa sub-rutele (HomeContent, SearchContent etc.) datorită lui <Outlet /> */}
      <Box
        ml={{ base: 0, md: "260px" }}
        pb={{ base: "80px", md: 10 }}
        pt={{ base: 6, md: 10 }}
        px={{ base: 4, md: 10, lg: 16 }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserPage;
