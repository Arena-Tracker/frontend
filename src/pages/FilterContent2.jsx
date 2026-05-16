import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Grid,
  Badge,
  Button,
  Image,
  Input,
  Spinner,
  Icon,
} from "@chakra-ui/react";

import { useParams, useLocation } from "react-router-dom";
import {
  FiMapPin,
  FiStar,
  FiChevronDown,
  FiFilter,
  FiSearch,
  FiCheckSquare,
  FiSquare,
  FiXCircle,
  FiCheckCircle,
} from "react-icons/fi";

import BookingModal from "../components/BookingModal";

const COURT_API_URL =
  import.meta.env.VITE_COURT_SERVICE_URL || "http://localhost:8082/api";

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
  border: "1px solid rgba(255, 255, 255, 0.05)",
  shadow: "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

const SPORT_MAPPING = {
  fotbal: 1,
  tenis: 2,
  baschet: 3,
  "ping-pong": 4,
  padel: 5,
  "tenis picior": 6,
  biliard: 7,
};

const CATEGORIES = [
  { label: "Fotbal", value: "fotbal" },
  { label: "Tenis", value: "tenis" },
  { label: "Baschet", value: "baschet" },
  { label: "Ping-Pong", value: "ping-pong" },
  { label: "Padel", value: "padel" },
  { label: "Tenis Picior", value: "tenis picior" },
  { label: "Biliard", value: "biliard" },
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

const SORT_OPTIONS = [
  { label: "Preț: Crescător", value: "ASC" },
  { label: "Preț: Descrescător", value: "DESC" },
];

const PremiumVenueCard = ({ venue, onReserve }) => (
  <Box
    w="full"
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
          <Text fontSize="xs" fontWeight="600">
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
          <Text
            fontSize="10px"
            color={DS.colors.muted}
            fontWeight="700"
            letterSpacing="0.5px"
          >
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

const PremiumDropdown = ({
  id,
  openDropdownId,
  setOpenDropdownId,
  value,
  options,
  onChange,
  placeholder,
}) => {
  const isOpen = openDropdownId === id;
  const handleSelect = (val) => {
    onChange(val);
    setOpenDropdownId(null);
  };
  const toggleDropdown = () => setOpenDropdownId(isOpen ? null : id);

  return (
    <Box position="relative" w="full" zIndex={isOpen ? 100 : 1}>
      <Flex
        bg={DS.colors.input}
        border="1px solid"
        borderColor={isOpen ? DS.colors.brand : "whiteAlpha.100"}
        borderRadius="xl"
        h="44px"
        px={4}
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={toggleDropdown}
        transition={DS.transition}
        _hover={{ borderColor: isOpen ? DS.colors.brand : "whiteAlpha.300" }}
      >
        <Text
          fontSize="sm"
          fontWeight="600"
          color={value ? DS.colors.text : DS.colors.muted}
        >
          {options.find((o) => (o.value || o) === value)?.label ||
            value ||
            placeholder}
        </Text>
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
          bg={DS.colors.card}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius="xl"
          boxShadow="0 25px 50px -12px rgba(0,0,0,0.9)"
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
          >
            <Text
              fontSize="sm"
              fontWeight="600"
              transition={DS.transition}
              color={!value ? DS.colors.brand : DS.colors.text}
            >
              {placeholder}
            </Text>
          </Flex>
          {options.map((opt) => {
            const optValue = typeof opt === "object" ? opt.value : opt;
            const optLabel = typeof opt === "object" ? opt.label : opt;
            return (
              <Flex
                key={optValue}
                px={4}
                py={2.5}
                cursor="pointer"
                onClick={() => handleSelect(optValue)}
                _hover={{ color: DS.colors.brand }}
              >
                <Text
                  fontSize="sm"
                  fontWeight="600"
                  transition={DS.transition}
                  color={value === optValue ? DS.colors.brand : DS.colors.text}
                >
                  {optLabel}
                </Text>
              </Flex>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

const FilterContent = () => {
  const { sportType } = useParams();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";
  const initialCategory = sportType === "toate" ? "" : sportType || "";

  const [openDropdownId, setOpenDropdownId] = useState(null);

  // Stări locale pentru input-urile de filtre
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSort, setSelectedSort] = useState("ASC");

  // Stări aplicate pe care se face efectiv fetch-ul
  const [appliedFilters, setAppliedFilters] = useState({
    query: initialQuery,
    category: initialCategory,
    location: "",
    sort: "ASC",
  });

  const [dbVenues, setDbVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [venueToBook, setVenueToBook] = useState(null);

  // Stare pentru TOAST GLOBAL (notificarea vine de la BookingModal)
  const [toastMessage, setToastMessage] = useState(null);
  const showGlobalToast = (title, description, status = "success") => {
    setToastMessage({ title, description, status });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    const fetchFilteredTerenuri = async () => {
      setIsLoading(true);
      try {
        const payload = {
          numeTeren: appliedFilters.query || null,
          idSport:
            SPORT_MAPPING[appliedFilters.category?.toLowerCase()] || null,
          oras: appliedFilters.location || null,
          sortare: appliedFilters.sort || "ASC",
        };

        const response = await fetch(`${COURT_API_URL}/terenuri/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok)
          throw new Error("Eroare la preluarea terenurilor filtrate.");
        const data = await response.json();

        const mappedVenues = await Promise.all(
          data.map(async (t) => {
            let realLocation = "Locație Necunoscută";
            try {
              const bazaRes = await fetch(
                `${COURT_API_URL}/terenuri/${t.idTeren || t.id}/baza-sportiva`,
              );
              if (bazaRes.ok) {
                const bazaData = await bazaRes.json();
                if (bazaData.oras) {
                  realLocation = bazaData.oras.replace(/_/g, " ");
                }
              }
            } catch (err) {
              console.warn(
                "Nu s-a putut prelua baza sportivă pentru teren:",
                t.numeTeren,
              );
            }

            return {
              id: t.idTeren || t.id,
              title: t.numeTeren,
              location: realLocation,
              price: t.pretPeOra,
              rating: "5.0",
              image:
                "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1173&auto=format&fit=crop",
              isNew: false,
              originalData: t,
            };
          }),
        );

        setDbVenues(mappedVenues);
      } catch (error) {
        console.error("Eroare în filtrare:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredTerenuri();
  }, [appliedFilters]);

  const handleApplyFilters = () => {
    setAppliedFilters({
      query: searchQuery,
      category: selectedCategory,
      location: selectedLocation,
      sort: selectedSort,
    });
    setOpenDropdownId(null);
  };

  const displayTitle = appliedFilters.category
    ? `Terenuri de ${CATEGORIES.find((c) => c.value === appliedFilters.category)?.label || appliedFilters.category}`
    : "Toate Terenurile";

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
      px={{ base: 4, md: 8 }}
    >
      {/* GLOBAL TOAST NOTIFICATION */}
      {toastMessage && (
        <Flex
          position="fixed"
          top="4"
          right="4"
          bg={toastMessage.status === "error" ? "#FF5F5F" : "#5ED1BE"}
          color={toastMessage.status === "error" ? "white" : "black"}
          px={6}
          py={4}
          borderRadius="xl"
          boxShadow="xl"
          zIndex={10000}
          alignItems="center"
          gap={4}
          animation="fade-in 0.3s ease-out"
        >
          <Icon
            as={toastMessage.status === "error" ? FiXCircle : FiCheckCircle}
            boxSize={6}
          />
          <Box>
            <Text fontWeight="900" fontSize="sm">
              {toastMessage.title}
            </Text>
            <Text fontSize="xs" fontWeight="600">
              {toastMessage.description}
            </Text>
          </Box>
        </Flex>
      )}

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
        position="relative"
        zIndex={1}
        maxW="1300px"
        mx="auto"
        pt={{ base: 4, md: 8 }}
      >
        <VStack align="flex-start" mb={8} spacing={2}>
          <Text
            fontSize="sm"
            fontWeight="800"
            color={DS.colors.brand}
            letterSpacing="1px"
            textTransform="uppercase"
          >
            Rezultate Căutare
          </Text>
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="900"
            color={DS.colors.text}
            letterSpacing="-1px"
          >
            {displayTitle}
          </Text>
        </VStack>

        <Box
          display={{ base: "block", lg: "grid" }}
          gridTemplateColumns={{ lg: "300px 1fr" }}
          gap={8}
        >
          {/* SIDEBAR FILTRE */}
          <Box
            bg={DS.colors.card}
            p={6}
            borderRadius="2xl"
            border={DS.border}
            boxShadow={DS.shadow}
            position={{ lg: "sticky" }}
            top={{ lg: "100px" }}
            h="fit-content"
            mb={{ base: 8, lg: 0 }}
          >
            <Flex align="center" gap={2} mb={5}>
              <FiFilter color={DS.colors.brand} />
              <Text color={DS.colors.text} fontWeight="800" fontSize="lg">
                Filtre Căutare
              </Text>
            </Flex>
            <Box
              w="100%"
              borderBottom="1px solid"
              borderColor="whiteAlpha.100"
              mb={6}
            />

            <VStack spacing={5} align="stretch">
              <Box>
                <Text
                  color={DS.colors.muted}
                  mb={2}
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.5px"
                >
                  CAUTĂ NUME
                </Text>
                <Flex
                  align="center"
                  bg={DS.colors.input}
                  borderRadius="xl"
                  px={4}
                  h="44px"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  _focusWithin={{ borderColor: DS.colors.brand }}
                  transition={DS.transition}
                >
                  <FiSearch color={DS.colors.muted} />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
                    placeholder="Ex: Arena..."
                    border="none"
                    bg="transparent"
                    color={DS.colors.text}
                    fontSize="sm"
                    fontWeight="600"
                    _focus={{ outline: "none", boxShadow: "none" }}
                    _placeholder={{ color: "whiteAlpha.300" }}
                    px={3}
                  />
                </Flex>
              </Box>

              <Box>
                <Text
                  color={DS.colors.muted}
                  mb={2}
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.5px"
                >
                  CATEGORIE SPORT
                </Text>
                <PremiumDropdown
                  id="category"
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
                  value={selectedCategory}
                  options={CATEGORIES}
                  onChange={setSelectedCategory}
                  placeholder="Toate sporturile"
                />
              </Box>

              <Box>
                <Text
                  color={DS.colors.muted}
                  mb={2}
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.5px"
                >
                  LOCAȚIE
                </Text>
                <PremiumDropdown
                  id="location"
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
                  value={selectedLocation}
                  options={formattedLocations}
                  onChange={setSelectedLocation}
                  placeholder="Toate locațiile"
                />
              </Box>

              <Box>
                <Text
                  color={DS.colors.muted}
                  mb={2}
                  fontSize="xs"
                  fontWeight="700"
                  letterSpacing="0.5px"
                >
                  SORTEAZĂ
                </Text>
                <PremiumDropdown
                  id="sort"
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
                  value={selectedSort}
                  options={SORT_OPTIONS}
                  onChange={setSelectedSort}
                  placeholder="Recomandate"
                />
              </Box>

              <Button
                w="100%"
                h="48px"
                mt={2}
                bg={DS.colors.brand}
                color="black"
                fontWeight="900"
                borderRadius="xl"
                _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                transition={DS.transition}
                onClick={handleApplyFilters}
              >
                Aplică Filtre
              </Button>
            </VStack>
          </Box>

          {/* GRID TERENURI REZULTATE */}
          <Box>
            {isLoading ? (
              <Flex justify="center" align="center" py={20}>
                <Spinner color={DS.colors.brand} size="xl" thickness="4px" />
              </Flex>
            ) : dbVenues.length > 0 ? (
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  xl: "repeat(3, 1fr)",
                }}
                gap={6}
              >
                {dbVenues.map((venue) => (
                  <PremiumVenueCard
                    key={venue.id}
                    venue={venue}
                    onReserve={setVenueToBook}
                  />
                ))}
              </Grid>
            ) : (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py={20}
                bg={DS.colors.card}
                borderRadius="2xl"
                border={`1px dashed rgba(255,255,255,0.1)`}
              >
                <Icon
                  as={FiSearch}
                  boxSize={10}
                  color={DS.colors.muted}
                  mb={4}
                />
                <Text color={DS.colors.text} fontSize="lg" fontWeight="800">
                  Nu am găsit rezultate.
                </Text>
                <Text color={DS.colors.muted} fontSize="sm">
                  Modifică filtrele pentru a găsi terenul potrivit.
                </Text>
              </Flex>
            )}
          </Box>
        </Box>
      </Box>

      {/* INTEGRARE MODAL */}
      <BookingModal
        venue={venueToBook}
        isOpen={!!venueToBook}
        onClose={() => setVenueToBook(null)}
        showGlobalToast={showGlobalToast}
      />
    </Box>
  );
};

export default FilterContent;
