import { useState } from "react";
import { Box } from "@chakra-ui/react";
import { colors } from "./colors";
import { Navigation } from "../components/Navigation";
import HomeContent from "./HomeContent";
import SearchContent from "./SearchContent";
import FilterContent from "./FilterContent";

const UserPage = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedSport, setSelectedSport] = useState("");

  // Funcția stabilă care face legătura între butoane și pagina de filtrare
  const handleSportSelect = (sportName) => {
    setSelectedSport(sportName);
    setActiveTab("filter");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeContent />;
      case "search":
        // Trimitem funcția către SearchContent
        return <SearchContent onSportSelect={handleSportSelect} />;
      case "filter":
        // Trimitem numele sportului ales către FilterContent
        return <FilterContent sport={selectedSport} />;
      case "bookings":
        return <Box color="white" p={10}>Pagina Rezervări</Box>;
      case "profile":
        return <Box color="white" p={10}>Pagina Profil</Box>;
      default:
        return <HomeContent />;
    }
  };

  return (
    <Box bg={colors.bgMain} minH="100vh">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== "filter") setSelectedSport(""); // Resetăm sportul dacă ieșim de pe pagină
        }} 
      />

      {/* Containerul principal - Aici e secretul pentru a nu se suprapune cu Navbar-ul */}
      <Box
        ml={{ base: 0, md: "260px" }} // Pe desktop lasă loc pentru meniul lateral
        pb={{ base: "80px", md: 10 }} // Pe mobile lasă loc pentru meniul de jos
        pt={{ base: 6, md: 10 }} // Puțin spațiu sus să respire
        px={{ base: 4, md: 10, lg: 16 }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default UserPage;