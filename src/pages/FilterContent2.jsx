import React, { useState } from "react";
import { Box, Flex, Text, VStack, Grid, Badge, Button, Image, Input } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// Iconițe
import { FiMapPin, FiStar, FiChevronDown, FiFilter, FiSearch } from "react-icons/fi";

/**
 * @constant DESIGN_SYSTEM
 * Baza noastră vizuală unitară
 */
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
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
};

const CATEGORIES = [
  { label: "Fotbal", value: "fotbal" },
  { label: "Baschet", value: "baschet" },
  { label: "Tenis", value: "tenis" },
  { label: "Volei", value: "volei" },
  { label: "Ping-Pong", value: "pingpong" },
];

const LOCATIONS = [
  "Bucuresti Sector 1", "Bucuresti Sector 2", "Bucuresti Sector 3",
  "Bucuresti Sector 4", "Bucuresti Sector 5", "Bucuresti Sector 6",
  "Buftea", "Chitila", "Magurele", "Otopeni", 
  "Pantelimon", "Popesti Leordeni", "Voluntari", "Bragadiru"
];

const SORT_OPTIONS = [
  { label: "Preț: Crescător", value: "asc" },
  { label: "Preț: Descrescător", value: "desc" }
];

// Date simulate pentru a popula grid-ul
const DUMMY_VENUES = [
  { id: 1, title: "Arena Națională Premium", location: "Sector 2, București", price: "200 RON", rating: "4.9", reviews: 210, image: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1173&auto=format&fit=crop", isNew: false },
  { id: 2, title: "Baza Sportivă Sud", location: "Sector 4, București", price: "120 RON", rating: "4.5", reviews: 89, image: "https://images.unsplash.com/photo-1518605368461-1e12d1b09b55?q=80&w=1170&auto=format&fit=crop", isNew: true },
  { id: 3, title: "Complex Sportiv Nord", location: "Otopeni, Ilfov", price: "150 RON", rating: "4.7", reviews: 142, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1035&auto=format&fit=crop", isNew: false },
  { id: 4, title: "Teren Sintetic Vest", location: "Sector 6, București", price: "100 RON", rating: "4.3", reviews: 56, image: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1173&auto=format&fit=crop", isNew: false },
];

/**
 * @component PremiumVenueCard
 */
const PremiumVenueCard = ({ venue }) => (
  <Box
    w="full"
    bg={DS.colors.card}
    borderRadius="2xl"
    overflow="hidden"
    border={DS.border}
    cursor="pointer"
    transition={DS.transition}
    _hover={{ transform: "translateY(-4px)", boxShadow: DS.shadow, borderColor: "whiteAlpha.200" }}
  >
    <Box position="relative" h="160px" w="full">
      <Image src={venue.image} alt={venue.title} objectFit="cover" w="full" h="full" loading="lazy" />
      <Box position="absolute" top={0} left={0} w="full" h="full" bg="linear-gradient(180deg, rgba(0,0,0,0) 50%, #16181C 100%)" />
      
      <Flex position="absolute" top={3} w="full" px={3} justify="space-between">
        {venue.isNew ? (
          <Badge bg={DS.colors.brand} color={DS.colors.canvas} px={2} py={1} borderRadius="lg" fontSize="10px" fontWeight="900">NOU</Badge>
        ) : <Box />}
        <Flex bg="blackAlpha.700" backdropFilter="blur(4px)" px={2} py={1} borderRadius="lg" align="center" gap={1.5}>
          <FiStar color="#F9F871" fill="#F9F871" size={12} />
          <Text color="white" fontSize="11px" fontWeight="800">{venue.rating}</Text>
        </Flex>
      </Flex>
    </Box>

    <VStack align="stretch" p={4} spacing={3}>
      <Box>
        <Text fontSize="md" fontWeight="800" color={DS.colors.text} noOfLines={1}>{venue.title}</Text>
        <Flex align="center" gap={1.5} mt={1} color={DS.colors.muted}>
          <FiMapPin size={12} />
          <Text fontSize="xs" fontWeight="600">{venue.location}</Text>
        </Flex>
      </Box>

      <Flex justify="space-between" align="center" pt={2} borderTop="1px solid" borderColor="whiteAlpha.100">
        <VStack align="start" spacing={0}>
          <Text fontSize="10px" color={DS.colors.muted} fontWeight="700" letterSpacing="0.5px">PREȚ / ORĂ</Text>
          <Text fontSize="sm" color={DS.colors.brand} fontWeight="900">{venue.price}</Text>
        </VStack>
        <Button size="sm" bg="whiteAlpha.100" color={DS.colors.text} borderRadius="xl" fontSize="12px" fontWeight="800" _hover={{ bg: DS.colors.brand, color: DS.colors.canvas }} transition={DS.transition}>
          Rezervă
        </Button>
      </Flex>
    </VStack>
  </Box>
);

/**
 * @component PremiumDropdown
 */
const PremiumDropdown = ({ id, openDropdownId, setOpenDropdownId, value, options, onChange, placeholder }) => {
  const isOpen = openDropdownId === id; 
  
  const handleSelect = (val) => {
    onChange(val);
    setOpenDropdownId(null); 
  };

  const toggleDropdown = () => {
    setOpenDropdownId(isOpen ? null : id); 
  };

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
        <Text fontSize="sm" fontWeight="600" color={value ? DS.colors.text : DS.colors.muted}>
          {options.find(o => (o.value || o) === value)?.label || value || placeholder}
        </Text>
        <FiChevronDown color={DS.colors.muted} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }} />
      </Flex>

      {isOpen && (
        <Box 
          position="absolute" top="calc(100% + 6px)" left="0" w="full" 
          bg={DS.colors.card} border="1px solid" borderColor="whiteAlpha.100" 
          borderRadius="xl" boxShadow="0 25px 50px -12px rgba(0,0,0,0.9)" 
          maxH="250px" overflowY="auto" py={2}
          sx={{ "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { bg: "whiteAlpha.200", borderRadius: "full" } }}
        >
          <Flex px={4} py={2.5} cursor="pointer" onClick={() => handleSelect("")} _hover={{ color: DS.colors.brand }}>
            <Text fontSize="sm" fontWeight="600" transition={DS.transition} color={!value ? DS.colors.brand : DS.colors.text}>{placeholder}</Text>
          </Flex>
          {options.map((opt) => {
            const isObj = typeof opt === 'object';
            const optValue = isObj ? opt.value : opt;
            const optLabel = isObj ? opt.label : opt;
            return (
              <Flex key={optValue} px={4} py={2.5} cursor="pointer" onClick={() => handleSelect(optValue)} _hover={{ color: DS.colors.brand }}>
                <Text fontSize="sm" fontWeight="600" transition={DS.transition} color={value === optValue ? DS.colors.brand : DS.colors.text}>
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
  
  // Dacă din link primim "toate", îl transformăm în string gol pentru a nu selecta o categorie anume.
  const initialCategory = sportType === "toate" ? "" : (sportType || "");

  const [openDropdownId, setOpenDropdownId] = useState(null);
  
  // State-uri pentru Filtre (Local/Pending)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

  const [appliedCategory, setAppliedCategory] = useState(initialCategory);

  // Logică smart pentru titlu
  const displayTitle = appliedCategory 
    ? `Terenuri de ${appliedCategory.charAt(0).toUpperCase() + appliedCategory.slice(1)}` 
    : "Toate Terenurile";

  // Formatăm locațiile
  const formattedLocations = LOCATIONS.map(loc => ({
    label: loc.replace(/_/g, ' '),
    value: loc
  }));

  const handleApplyFilters = () => {
    setAppliedCategory(selectedCategory);
    setOpenDropdownId(null); 
    // TODO: Apel Backend
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
      {/* FUNDAL ABSTRACT */}
      <Box position="absolute" top="-10%" left="-10%" w="70vw" h="70vw" bg="radial-gradient(circle, rgba(94, 209, 190, 0.08) 0%, transparent 60%)" zIndex="0" pointerEvents="none" />
      
      <Box position="relative" zIndex={1} maxW="1300px" mx="auto" pt={{ base: 4, md: 8 }}>
        
        {/* HEADER */}
        <VStack align="flex-start" mb={8} spacing={2}>
          <Text fontSize="sm" fontWeight="800" color={DS.colors.brand} letterSpacing="1px" textTransform="uppercase">
            Rezultate Căutare
          </Text>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="900" color={DS.colors.text} letterSpacing="-1px">
            {displayTitle}
          </Text>
        </VStack>

        {/* LAYOUT PRINCIPAL: Sidebar (Stânga) + Grid (Dreapta) */}
        <Box display={{ base: "block", lg: "grid" }} gridTemplateColumns={{ lg: "300px 1fr" }} gap={8}>
          
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
              <Text color={DS.colors.text} fontWeight="800" fontSize="lg">Filtre Căutare</Text>
            </Flex>
            
            <Box w="100%" borderBottom="1px solid" borderColor="whiteAlpha.100" mb={6} />
            
            <VStack spacing={5} align="stretch">

              {/* SEARCH BAR CUSTOM */}
              <Box>
                <Text color={DS.colors.muted} mb={2} fontSize="xs" fontWeight="700" letterSpacing="0.5px">CAUTĂ NUME</Text>
                <Flex 
                  align="center" bg={DS.colors.input} borderRadius="xl" px={4} h="44px" 
                  border="1px solid" borderColor="whiteAlpha.100" _focusWithin={{ borderColor: DS.colors.brand }} 
                  transition={DS.transition}
                >
                  <FiSearch color={DS.colors.muted} />
                  <Input 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ex: Arena..." 
                    border="none" bg="transparent" color={DS.colors.text} 
                    fontSize="sm" fontWeight="600" 
                    _focus={{ outline: "none", boxShadow: "none" }} _placeholder={{ color: "whiteAlpha.300" }} 
                    px={3}
                  />
                </Flex>
              </Box>

              {/* FILTRU CATEGORIE (SPORT) */}
              <Box>
                <Text color={DS.colors.muted} mb={2} fontSize="xs" fontWeight="700" letterSpacing="0.5px">CATEGORIE SPORT</Text>
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
              
              {/* FILTRU LOCAȚIE */}
              <Box>
                <Text color={DS.colors.muted} mb={2} fontSize="xs" fontWeight="700" letterSpacing="0.5px">LOCAȚIE</Text>
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

              {/* FILTRU SORTARE */}
              <Box>
                <Text color={DS.colors.muted} mb={2} fontSize="xs" fontWeight="700" letterSpacing="0.5px">SORTEAZĂ</Text>
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
            <Grid 
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", xl: "repeat(3, 1fr)" }} 
              gap={6}
            >
              {DUMMY_VENUES.map((venue) => (
                <PremiumVenueCard key={venue.id} venue={venue} />
              ))}
              {DUMMY_VENUES.map((venue) => (
                <PremiumVenueCard key={`dup-${venue.id}`} venue={venue} />
              ))}
            </Grid>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default FilterContent;