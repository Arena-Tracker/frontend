import { Box, Flex, Icon, Input, Text, Grid } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { FaFutbol, FaBasketballBall, FaTableTennis } from "react-icons/fa";
import { GiTennisRacket, GiEightBall, GiTennisCourt } from "react-icons/gi";
import { MdSportsTennis } from "react-icons/md";
import { colors } from "./colors";
import SportCard from "../components/SportCard";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const handleCardClick = (sportLabel) => {
    // Navigam catre /user/search/filter/fotbal
    navigate(`filter/${sportLabel.toLowerCase()}`);
  };

  return (
    <Box maxW="1200px" mx="auto" pt={4}>
      <Box mb={12}>
        <Flex 
          align="center" 
          bg={colors.bgCard} 
          borderRadius="2xl" 
          px={6} 
          h="64px" 
          maxW="700px" 
          mx="auto" 
          boxShadow="md" 
          _focusWithin={{ boxShadow: `0 0 0 1px ${colors.accent}` }}
        >
          <Icon as={FiSearch} color="gray.400" boxSize={6} mr={4} />
          <Input 
            placeholder="Caută terenuri, sporturi, locații..." 
            border="none" 
            bg="transparent" 
            color={colors.textMain} 
            fontSize="lg" 
            _focus={{ boxShadow: "none" }} 
          />
        </Flex>
      </Box>

      <Text fontSize={{ base: "xl", md: "3xl" }} fontWeight="700" color="white" mb={10} textAlign="center">
        Alege sportul tău preferat
      </Text>

      <Grid 
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, max-content)", lg: "repeat(4, max-content)" }} 
        gap={8} 
        justifyContent="center"
      >
        {SPORTS_DATA.map((sport) => (
          <SportCard
            key={sport.id}
            icon={sport.icon}
            label={sport.label}
            cardBg={sport.bg}
            size="lg"
            onClick={() => handleCardClick(sport.label)}
          />
        ))}
      </Grid>
    </Box>
  );
};

export default SearchContent;