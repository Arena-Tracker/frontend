import React from "react";
// Importăm Grid în loc de SimpleGrid/Flex
import { Box, Flex, Icon, Input, Text, Grid } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { FaFutbol, FaBasketballBall, FaTableTennis } from "react-icons/fa";
import { GiTennisRacket, GiEightBall, GiTennisCourt } from "react-icons/gi";
import { MdSportsTennis } from "react-icons/md";
// import { useNavigate } from "react-router-dom"; // <-- Decomentează dacă folosești react-router pentru navigare

import { colors } from "./colors";
import SportCard from "../components/SportCard";

const SPORTS_DATA = [
  { id: "fotbal", label: "Fotbal", icon: FaFutbol, bg: "#6B8E5C" },
  { id: "tenis", label: "Tenis", icon: GiTennisRacket, bg: "#7EA3A3" },
  { id: "baschet", label: "Baschet", icon: FaBasketballBall, bg: "#D4A054" },
  { id: "pingpong", label: "Ping-Pong", icon: FaTableTennis, bg: "#8B8DF4" },
  { id: "padel", label: "Padel", icon: MdSportsTennis, bg: "#72A1B6" },
  { id: "tenispicior", label: "Tenis de Picior", icon: GiTennisCourt, bg: "#B8B775" },
  { id: "biliard", label: "Biliard", icon: GiEightBall, bg: "#7EA3A3" },
];

const SearchContent = () => {
  // const navigate = useNavigate();

  // Funcția care se va apela la click
  const handleSportClick = (sportId) => {
    console.log("Navigare către sportul:", sportId);
    // Aici apelezi noul endpoint. Exemplu:
    // navigate(`/rezervari/${sportId}`); 
  };

  return (
    <Box maxW="1400px" mx="auto" pt={{ base: 0, md: 6 }}>
      
      {/* Bara de search */}
      <Flex 
        align="center" 
        bg={colors.bgCard} 
        borderRadius="2xl" 
        px={6} 
        h={{ base: "56px", md: "64px", lg: "72px" }}
        mb={{ base: 10, md: 16 }} 
        maxW="800px" 
        mx="auto" 
        border="1px solid transparent"
        transition="all 0.2s"
        boxShadow="md"
        _focusWithin={{ 
          borderColor: colors.accent, 
          boxShadow: `0 0 0 1px ${colors.accent}` 
        }}
      >
        <Icon as={FiSearch} color="gray.400" boxSize={{ base: 5, md: 6 }} mr={4} />
        <Input 
          placeholder="Caută după nume sau locație..." 
          border="none" 
          bg="transparent"
          color={colors.textMain}
          fontSize={{ base: "md", md: "lg" }}
          _focus={{ outline: "none", boxShadow: "none", border: "none" }} 
          _focusVisible={{ outline: "none", boxShadow: "none", border: "none" }}
        />
      </Flex>

      <Box maxW="1200px" mx="auto">
        <Text
          fontSize={{ base: "xl", md: "3xl" }}
          fontWeight="700"
          color={colors.textMain}
          mb={{ base: 6, md: 12 }}
          textAlign={{ base: "left", md: "center" }}
        >
          Alege sportul tău preferat
        </Text>

        {/* Noul layout: Grid automat care aliniază ultimul element la stânga */}
        <Grid 
          templateColumns={{ 
            base: "repeat(2, 1fr)",        // Mobile: 2 coloane egale pe tot ecranul
            md: "repeat(3, max-content)",  // Tablete: 3 coloane cât lățimea cardului
            lg: "repeat(4, max-content)"   // Desktop: 4 coloane cât lățimea cardului
          }} 
          gap={{ base: 4, sm: 6, md: 8, lg: 10 }}
          justifyContent="center" // Această regulă centrează întregul grup de coloane
        >
          {SPORTS_DATA.map((sport) => (
            <SportCard
              key={sport.id}
              icon={sport.icon}
              label={sport.label}
              cardBg={sport.bg}
              color="white"
              size="lg"
              onClick={() => handleSportClick(sport.id)} // Transmitem funcția mai departe
            />
          ))}
        </Grid>
      </Box>

    </Box>
  );
};

export default SearchContent;