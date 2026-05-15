import React, { useState } from "react";
import { Box, Flex, Text, Input, Grid, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// Iconițe
import { FiSearch } from "react-icons/fi";
import { FaFutbol, FaBasketballBall, FaTableTennis } from "react-icons/fa";
import { GiTennisRacket, GiEightBall, GiTennisCourt } from "react-icons/gi";
import { MdSportsTennis } from "react-icons/md";

const DS = {
  colors: {
    canvas: "#0B0C0E",
    card: "#16181C",
    input: "#22252A",
    brand: "#5ED1BE",
    text: "#F2F2F2",
    muted: "#8E8E93",
  },
  border: "1px solid rgba(255, 255, 255, 0.05)",
  shadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

// Mapare EXACTĂ a celor 7 sporturi cerute
const SPORTS_DATA = [
  { id: "fotbal", label: "Fotbal", icon: FaFutbol, color: "#5ED1BE" },
  { id: "tenis", label: "Tenis", icon: GiTennisRacket, color: "#A855F7" },
  { id: "baschet", label: "Baschet", icon: FaBasketballBall, color: "#F97316" },
  {
    id: "ping-pong",
    label: "Ping-Pong",
    icon: FaTableTennis,
    color: "#3B82F6",
  },
  { id: "padel", label: "Padel", icon: MdSportsTennis, color: "#EC4899" },
  {
    id: "tenis picior",
    label: "Tenis Picior",
    icon: GiTennisCourt,
    color: "#EAB308",
  },
  { id: "biliard", label: "Biliard", icon: GiEightBall, color: "#EF4444" },
];

const PremiumCategoryCard = ({ sport, onClick }) => {
  const IconComponent = sport.icon;
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      bg={DS.colors.card}
      border={DS.border}
      borderRadius="3xl"
      p={6}
      h="160px"
      gap={5}
      cursor="pointer"
      transition={DS.transition}
      onClick={onClick}
      role="group"
      _hover={{
        transform: "translateY(-6px)",
        borderColor: sport.color,
        boxShadow: `0 15px 30px -10px ${sport.color}40`,
        bg: "rgba(22, 24, 28, 0.8)",
      }}
    >
      <Box
        color={sport.color}
        transition={DS.transition}
        _groupHover={{ transform: "scale(1.15)" }}
      >
        <IconComponent size={56} />
      </Box>
      <Text
        fontSize="md"
        fontWeight="800"
        color={DS.colors.text}
        letterSpacing="-0.5px"
      >
        {sport.label}
      </Text>
    </Flex>
  );
};

const SearchContent = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCardClick = (sportId) => {
    navigate(`/user/search/filter/${sportId}`);
  };

  const handleGlobalSearch = (e) => {
    // Navigăm către FilterContent doar la apăsarea Enter sau la click pe iconiță
    if (e.key === "Enter" || e.type === "click") {
      const query =
        searchQuery.trim() !== ""
          ? `?q=${encodeURIComponent(searchQuery)}`
          : "";
      navigate(`/user/search/filter/toate${query}`);
    }
  };

  return (
    <Box
      position="relative"
      minH="100vh"
      bg={DS.colors.canvas}
      overflow="hidden"
      mt={{ base: -6, md: -10 }}
      mb={{ base: "-80px", md: -10 }}
      mx={{ base: -4, md: -10, lg: -16 }}
      py={{ base: 10, md: 16 }}
      px={{ base: 4, md: 8 }}
    >
      <Box
        position="absolute"
        top="-10%"
        left="-10%"
        w="70vw"
        h="70vw"
        bg="radial-gradient(circle, rgba(94, 209, 190, 0.08) 0%, transparent 60%)"
        zIndex="0"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="10%"
        right="-10%"
        w="70vw"
        h="70vw"
        bg="radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 60%)"
        zIndex="0"
        pointerEvents="none"
      />

      <Box position="relative" zIndex={1} maxW="1000px" mx="auto">
        <VStack spacing={8} mb={16} mt={{ base: 4, md: 10 }}>
          <VStack spacing={2} textAlign="center">
            <Text
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="900"
              color={DS.colors.text}
              letterSpacing="-1px"
            >
              Ce sport joci azi?
            </Text>
            <Text fontSize="md" color={DS.colors.muted} fontWeight="500">
              Alege o categorie sau caută direct locația dorită.
            </Text>
          </VStack>

          <Flex
            w="full"
            maxW="700px"
            align="center"
            bg="rgba(22, 24, 28, 0.7)"
            backdropFilter="blur(15px)"
            borderRadius="2xl"
            px={6}
            h="68px"
            border="1px solid"
            borderColor="whiteAlpha.100"
            boxShadow="0 20px 40px -15px rgba(0,0,0,0.4)"
            transition={DS.transition}
            _focusWithin={{ borderColor: DS.colors.brand, bg: DS.colors.input }}
          >
            <Box
              as="button"
              onClick={handleGlobalSearch}
              color={DS.colors.muted}
              mr={4}
              _hover={{ color: DS.colors.brand }}
              transition={DS.transition}
            >
              <FiSearch size={22} />
            </Box>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleGlobalSearch}
              placeholder="Caută terenuri, locații sau cluburi..."
              border="none"
              bg="transparent"
              color={DS.colors.text}
              fontSize="lg"
              fontWeight="600"
              _placeholder={{ color: "whiteAlpha.300" }}
              _focus={{ outline: "none", boxShadow: "none" }}
              _focusVisible={{ outline: "none", boxShadow: "none" }}
            />
          </Flex>
        </VStack>

        <Box px={{ base: 2, md: 0 }}>
          <Text
            fontSize="sm"
            fontWeight="800"
            color={DS.colors.muted}
            letterSpacing="1px"
            mb={6}
            textTransform="uppercase"
          >
            Toate Sporturile
          </Text>

          <Grid
            templateColumns="repeat(auto-fill, minmax(160px, 1fr))"
            gap={{ base: 4, md: 6 }}
          >
            {SPORTS_DATA.map((sport) => (
              <PremiumCategoryCard
                key={sport.id}
                sport={sport}
                onClick={() => handleCardClick(sport.id)}
              />
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default SearchContent;
