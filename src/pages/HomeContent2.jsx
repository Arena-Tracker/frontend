import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  HStack,
  Image,
  Badge,
  Button,
  VStack,
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom"; // Import adăugat pentru navigare
import {
  FiSearch,
  FiMapPin,
  FiStar,
  FiSliders,
  FiChevronDown,
  FiBell,
  FiSquare,
  FiCheckSquare,
} from "react-icons/fi";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";
import { GiTennisRacket, GiVolleyballBall } from "react-icons/gi";

// IMPORTĂ MODALUL
import BookingModal from "../components/BookingModal";

const DS = {
  colors: {
    canvas: "#0B0C0E",
    card: "#16181C",
    input: "#22252A",
    brand: "#5ED1BE",
    text: "#F2F2F2",
    muted: "#8E8E93",
    danger: "#FF5F5F",
  },
  border: "1px solid rgba(255, 255, 255, 0.08)",
  shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

const DUMMY_VENUES = [
  {
    id: 1,
    title: "Baza Sportivă Juventus",
    location: "Berceni, Sector 4",
    price: 100,
    rating: "4.8",
    reviews: 124,
    image:
      "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1173&auto=format&fit=crop",
    isNew: false,
  },
  {
    id: 2,
    title: "Arena Tineretului Premium",
    location: "Parcul Tineretului",
    price: 150,
    rating: "4.9",
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1035&auto=format&fit=crop",
    isNew: true,
  },
  {
    id: 3,
    title: "Complex Sportiv Sud",
    location: "Aparatorii Patriei",
    price: 120,
    rating: "4.5",
    reviews: 42,
    image:
      "https://images.unsplash.com/photo-1518605368461-1e12d1b09b55?q=80&w=1170&auto=format&fit=crop",
    isNew: false,
  },
];

const SPORT_CATEGORIES = [
  { id: 1, name: "Fotbal", icon: FaFutbol, color: "#5ED1BE" },
  { id: 2, name: "Baschet", icon: FaBasketballBall, color: "#F97316" },
  { id: 3, name: "Tenis", icon: GiTennisRacket, color: "#A855F7" },
  { id: 4, name: "Volei", icon: GiVolleyballBall, color: "#3B82F6" },
];

const LOCATIONS = [
  "BUCURESTI_SECTOR1",
  "BUCURESTI_SECTOR2",
  "BUCURESTI_SECTOR3",
  "BUCURESTI_SECTOR4",
  "BUCURESTI_SECTOR5",
  "BUCURESTI_SECTOR6",
  "BUFTEA",
  "CHITILA",
  "MAGURELE",
  "OTOPENI",
  "PANTELIMON",
  "POPESTI_LEORDENI",
  "VOLUNTARI",
  "BRAGADIRU",
];

const PremiumSportCard = ({ sport }) => {
  const IconComponent = sport.icon;
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      bg={DS.colors.card}
      border={DS.border}
      borderRadius="2xl"
      minW="100px"
      h="100px"
      gap={3}
      cursor="pointer"
      transition={DS.transition}
      _hover={{
        transform: "translateY(-4px)",
        borderColor: sport.color,
        boxShadow: `0 8px 20px -5px ${sport.color}40`,
      }}
    >
      <Box color={sport.color}>
        <IconComponent size={28} />
      </Box>
      <Text fontSize="xs" fontWeight="700" color={DS.colors.text}>
        {sport.name}
      </Text>
    </Flex>
  );
};

const PremiumVenueCard = ({ venue, onReserve }) => (
  <Box
    minW={{ base: "280px", md: "320px" }}
    bg={DS.colors.card}
    borderRadius="2xl"
    overflow="hidden"
    border={DS.border}
    cursor="pointer"
    transition={DS.transition}
    _hover={{
      transform: "translateY(-4px)",
      boxShadow: DS.shadow,
      borderColor: "whiteAlpha.200",
    }}
  >
    <Box position="relative" h="160px" w="full">
      <Image
        src={venue.image}
        alt={venue.title}
        objectFit="cover"
        w="full"
        h="full"
        loading="lazy"
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        bg="linear-gradient(180deg, rgba(0,0,0,0) 50%, #16181C 100%)"
      />
      <Flex position="absolute" top={3} w="full" px={3} justify="space-between">
        {venue.isNew ? (
          <Badge
            bg={DS.colors.brand}
            color={DS.colors.canvas}
            px={2}
            py={1}
            borderRadius="lg"
            fontSize="10px"
            fontWeight="900"
          >
            NOU
          </Badge>
        ) : (
          <Box />
        )}
        <Flex
          bg="blackAlpha.700"
          backdropFilter="blur(4px)"
          px={2}
          py={1}
          borderRadius="lg"
          align="center"
          gap={1.5}
        >
          <FiStar color="#F9F871" fill="#F9F871" size={12} />
          <Text color="white" fontSize="11px" fontWeight="800">
            {venue.rating}
          </Text>
        </Flex>
      </Flex>
    </Box>
    <VStack align="stretch" p={4} spacing={3}>
      <Box>
        <Text
          fontSize="md"
          fontWeight="800"
          color={DS.colors.text}
          noOfLines={1}
        >
          {venue.title}
        </Text>
        <Flex align="center" gap={1.5} mt={1} color={DS.colors.muted}>
          <FiMapPin size={12} />
          <Text fontSize="xs" fontWeight="600" isTruncated>
            {venue.location}
          </Text>
        </Flex>
      </Box>
      <Flex
        justify="space-between"
        align="center"
        pt={2}
        borderTop="1px solid"
        borderColor="whiteAlpha.100"
      >
        <VStack align="start" spacing={0}>
          <Text fontSize="10px" color={DS.colors.muted} fontWeight="700">
            PREȚ / ORĂ
          </Text>
          <Text fontSize="sm" color={DS.colors.brand} fontWeight="900">
            {venue.price} RON
          </Text>
        </VStack>
        <Button
          size="sm"
          bg="whiteAlpha.100"
          color={DS.colors.text}
          borderRadius="xl"
          fontSize="12px"
          fontWeight="800"
          _hover={{ bg: DS.colors.brand, color: DS.colors.canvas }}
          transition={DS.transition}
          onClick={(e) => {
            e.stopPropagation();
            onReserve(venue);
          }}
        >
          Rezervă
        </Button>
      </Flex>
    </VStack>
  </Box>
);

// Componenta de layout actualizată cu hook-ul de navigare
const SectionLayout = ({
  title,
  children,
  showViewAll = true,
  viewAllPath,
}) => {
  const navigate = useNavigate();

  return (
    <Box w="full" mb={8}>
      <Flex
        justify="space-between"
        align="flex-end"
        mb={2}
        px={{ base: 4, md: 8 }}
      >
        <Text
          fontSize="lg"
          fontWeight="900"
          color={DS.colors.text}
          letterSpacing="-0.5px"
        >
          {title}
        </Text>
        {showViewAll && viewAllPath ? (
          <Text
            fontSize="xs"
            fontWeight="700"
            color={DS.colors.brand}
            cursor="pointer"
            onClick={() => navigate(viewAllPath)}
            _hover={{ textDecoration: "underline" }}
            transition="all 0.2s"
          >
            Vezi toate
          </Text>
        ) : showViewAll && !viewAllPath ? (
          <Text
            fontSize="xs"
            fontWeight="700"
            color={DS.colors.brand}
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            transition="all 0.2s"
          >
            Vezi toate
          </Text>
        ) : null}
      </Flex>
      <Flex
        overflowX="auto"
        gap={4}
        px={{ base: 4, md: 8 }}
        py={4}
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        {children}
      </Flex>
    </Box>
  );
};

const PremiumDropdown = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };
  const selectedOption = options.find((o) => o.value === value);
  const buttonLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <Box position="relative" w="full">
      <Flex
        bg="blackAlpha.400"
        border="1px solid"
        borderColor={isOpen ? DS.colors.brand : "whiteAlpha.100"}
        borderRadius="xl"
        h="36px"
        px={3}
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        transition={DS.transition}
        _hover={{ borderColor: isOpen ? DS.colors.brand : "whiteAlpha.300" }}
      >
        <HStack spacing={2} maxW="calc(100% - 20px)" isTruncated>
          <Box color={selectedOption ? DS.colors.brand : DS.colors.muted}>
            {selectedOption ? (
              <FiCheckSquare size={16} />
            ) : (
              <FiSquare size={16} />
            )}
          </Box>
          <Text
            fontSize="sm"
            fontWeight="600"
            color={selectedOption ? DS.colors.text : DS.colors.muted}
            isTruncated
          >
            {buttonLabel}
          </Text>
        </HStack>
        <FiChevronDown
          color={DS.colors.muted}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.2s",
          }}
        />
      </Flex>
      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          left="0"
          w="full"
          zIndex={20}
          bg={DS.colors.card}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius="xl"
          boxShadow="0 25px 50px -12px rgba(0,0,0,0.8)"
          maxH="250px"
          overflowY="auto"
          py={2}
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              bg: "whiteAlpha.200",
              borderRadius: "full",
            },
          }}
        >
          <Flex
            px={4}
            py={2.5}
            cursor="pointer"
            onClick={() => handleSelect("")}
            _hover={{ color: DS.colors.brand }}
            transition={DS.transition}
            color={!selectedOption ? DS.colors.brand : DS.colors.text}
          >
            <HStack spacing={2}>
              <Box color={!selectedOption ? DS.colors.brand : DS.colors.muted}>
                {!selectedOption ? (
                  <FiCheckSquare size={16} />
                ) : (
                  <FiSquare size={16} />
                )}
              </Box>
              <Text fontSize="sm" fontWeight="600">
                {placeholder}
              </Text>
            </HStack>
          </Flex>
          {options.map((opt) => (
            <Flex
              key={opt.value}
              px={4}
              py={2.5}
              cursor="pointer"
              onClick={() => handleSelect(opt.value)}
              _hover={{ color: DS.colors.brand }}
              transition={DS.transition}
              color={value === opt.value ? DS.colors.brand : DS.colors.text}
            >
              <HStack spacing={2}>
                <Box
                  color={
                    value === opt.value ? DS.colors.brand : DS.colors.muted
                  }
                >
                  {value === opt.value ? (
                    <FiCheckSquare size={16} />
                  ) : (
                    <FiSquare size={16} />
                  )}
                </Box>
                <Text fontSize="sm" fontWeight="600" isTruncated>
                  {opt.label}
                </Text>
              </HStack>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
};

const HomeContent = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSportFilter, setSelectedSportFilter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [venueToBook, setVenueToBook] = useState(null);

  const formattedLocations = LOCATIONS.map((loc) => ({
    label: loc.replace(/_/g, " "),
    value: loc,
  }));

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
        bottom="20%"
        right="-10%"
        w="70vw"
        h="70vw"
        bg="radial-gradient(circle, rgba(41, 128, 185, 0.08) 0%, transparent 60%)"
        zIndex="0"
        pointerEvents="none"
      />

      <Box position="relative" zIndex={1} maxW="1200px" mx="auto">
        <Flex
          justify="space-between"
          align="center"
          px={{ base: 4, md: 8 }}
          mb={8}
        >
          <Box>
            <Text fontSize="sm" color={DS.colors.muted} fontWeight="700">
              Salutare, Alexandru! 👋
            </Text>
            <Text
              fontSize="2xl"
              color={DS.colors.text}
              fontWeight="900"
              letterSpacing="-1px"
            >
              Găsește terenul perfect
            </Text>
          </Box>
          <Flex
            as="button"
            boxSize="44px"
            align="center"
            justify="center"
            bg={DS.colors.card}
            border={DS.border}
            borderRadius="xl"
            color={DS.colors.text}
            transition={DS.transition}
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <FiBell size={20} />
          </Flex>
        </Flex>

        <Box px={{ base: 4, md: 8 }} mb={10}>
          <Flex
            align="center"
            bg="rgba(22, 24, 28, 0.7)"
            backdropFilter="blur(10px)"
            borderRadius={showFilters ? "2xl 2xl 0 0" : "2xl"}
            px={5}
            h="64px"
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderBottomColor={showFilters ? "transparent" : "whiteAlpha.100"}
            boxShadow="0 10px 30px -10px rgba(0,0,0,0.3)"
            transition={DS.transition}
            _focusWithin={{ borderColor: DS.colors.brand, bg: DS.colors.input }}
            position="relative"
            zIndex={3}
            gap={3}
          >
            <Box color={DS.colors.muted}>
              <FiSearch size={20} />
            </Box>
            <Input
              placeholder="Caută după nume..."
              border="none"
              bg="transparent"
              color={DS.colors.text}
              fontSize="md"
              fontWeight="600"
              _placeholder={{ color: "whiteAlpha.400" }}
              _focus={{ outline: "none", boxShadow: "none" }}
            />
            <Box w="1px" h="50%" bg="whiteAlpha.200" />
            <Box
              as="button"
              color={showFilters ? DS.colors.brand : DS.colors.muted}
              cursor="pointer"
              onClick={() => setShowFilters(!showFilters)}
              transition="all 0.2s"
              _hover={{ color: DS.colors.brand }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FiSliders size={20} />
            </Box>
          </Flex>
          <Box
            display="grid"
            gridTemplateRows={showFilters ? "1fr" : "0fr"}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            opacity={showFilters ? 1 : 0}
            position="relative"
            zIndex={2}
          >
            <Box overflow={showFilters ? "visible" : "hidden"}>
              <Box
                bg="rgba(22, 24, 28, 0.85)"
                backdropFilter="blur(15px)"
                p={5}
                borderRadius="0 0 2xl 2xl"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderTop="none"
                boxShadow="0 20px 40px -10px rgba(0,0,0,0.5)"
              >
                <Flex direction={{ base: "column", md: "row" }} gap={6} mb={5}>
                  <Box flex={1}>
                    <Text
                      fontSize="10px"
                      fontWeight="800"
                      color={DS.colors.muted}
                      letterSpacing="1px"
                      mb={2}
                    >
                      CATEGORIE
                    </Text>
                    <Flex wrap="wrap" gap={2}>
                      {SPORT_CATEGORIES.map((sport) => (
                        <Button
                          key={sport.id}
                          size="sm"
                          h="36px"
                          px={4}
                          bg={
                            selectedSportFilter === sport.id
                              ? "transparent"
                              : "transparent"
                          }
                          color={
                            selectedSportFilter === sport.id
                              ? DS.colors.brand
                              : DS.colors.text
                          }
                          border="1px solid"
                          borderColor={
                            selectedSportFilter === sport.id
                              ? DS.colors.brand
                              : "whiteAlpha.200"
                          }
                          borderRadius="xl"
                          fontWeight="700"
                          onClick={() =>
                            setSelectedSportFilter(
                              sport.id === selectedSportFilter
                                ? null
                                : sport.id,
                            )
                          }
                          _hover={{
                            borderColor:
                              selectedSportFilter === sport.id
                                ? DS.colors.brand
                                : "whiteAlpha.400",
                          }}
                          transition={DS.transition}
                        >
                          {sport.name}
                        </Button>
                      ))}
                    </Flex>
                  </Box>
                  <Box flex={1}>
                    <Text
                      fontSize="10px"
                      fontWeight="800"
                      color={DS.colors.muted}
                      letterSpacing="1px"
                      mb={2}
                    >
                      LOCAȚIE
                    </Text>
                    <PremiumDropdown
                      value={selectedLocation}
                      options={formattedLocations}
                      onChange={setSelectedLocation}
                      placeholder="Toate locațiile"
                    />
                  </Box>
                </Flex>
                <HStack spacing={4}>
                  <Button
                    flex={1}
                    variant="unstyled"
                    color={DS.colors.text}
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    h="40px"
                    borderRadius="lg"
                    fontWeight="700"
                    fontSize="xs"
                    onClick={() => {
                      setSelectedSportFilter(null);
                      setSelectedLocation("");
                    }}
                    _hover={{ bg: "whiteAlpha.200" }}
                    transition={DS.transition}
                  >
                    Resetează
                  </Button>
                  <Button
                    flex={1}
                    bg={DS.colors.brand}
                    color={DS.colors.card}
                    h="40px"
                    borderRadius="lg"
                    fontWeight="800"
                    fontSize="xs"
                    onClick={() => setShowFilters(false)}
                    _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                    transition={DS.transition}
                  >
                    Aplică filtre
                  </Button>
                </HStack>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* SECȚIUNI ACTUALIZATE CU RUTE DE VIEW ALL */}
        <SectionLayout title="Sporturi" showViewAll={false}>
          {SPORT_CATEGORIES.map((sport) => (
            <PremiumSportCard key={sport.id} sport={sport} />
          ))}
        </SectionLayout>

        <SectionLayout
          title="Recomandate pentru tine"
          viewAllPath="/user/search/filter/toate?sort=recomandate"
        >
          {DUMMY_VENUES.map((venue) => (
            <PremiumVenueCard
              key={venue.id}
              venue={venue}
              onReserve={setVenueToBook}
            />
          ))}
        </SectionLayout>

        <SectionLayout
          title="Populare în zona ta"
          viewAllPath="/user/search/filter/toate?sort=populare"
        >
          {[...DUMMY_VENUES].reverse().map((venue) => (
            <PremiumVenueCard
              key={`pop-${venue.id}`}
              venue={venue}
              onReserve={setVenueToBook}
            />
          ))}
        </SectionLayout>
      </Box>

      {/* RENDER MODAL EXTERN */}
      <BookingModal
        venue={venueToBook}
        isOpen={!!venueToBook}
        onClose={() => setVenueToBook(null)}
      />
    </Box>
  );
};

export default HomeContent;
