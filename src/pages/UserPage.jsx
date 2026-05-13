import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { colors } from "./colors";
import { Navigation } from "../components/Navigation";
import HomeContent from "./HomeContent";
import { FiCalendar, FiHome, FiSearch, FiUser } from "react-icons/fi";

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
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        navItems={NAV_ITEMS_USER}
        title="SportApp."
      />

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