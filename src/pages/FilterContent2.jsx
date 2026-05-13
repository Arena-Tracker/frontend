import React, { useState } from "react";
import { Box, Flex, Text, VStack, Grid, Input, Badge, Button, Image } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// Iconițe
import { FiMapPin, FiStar, FiChevronDown, FiFilter } from "react-icons/fi";

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

const LOCATIONS = [
  "Bucuresti Sector 1", "Bucuresti Sector 2", "Bucuresti Sector 3",
  "Bucuresti Sector 4", "Bucuresti Sector 5", "Bucuresti Sector 6",
  "Buftea", "Chitila", "Magurele", "Otopeni", 
  "Pantelimon", "Popesti Leordeni", "Voluntari", "Bragadiru"
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
 * Reutilizat pentru a păstra tema premium a aplicației
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


const FilterContent = () => {
  const { sportType } = useParams();
  const title = sportType ? sportType.charAt(0).toUpperCase() + sportType.slice(1) : "Sport";

  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedSort, setSelectedSort] = useState("");

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
            Terenuri de {title}
          </Text>
        </VStack>

        {/* LAYOUT PRINCIPAL: Sidebar (Stânga) + Grid (Dreapta) */}
        <Box display={{ base: "block", lg: "grid" }} gridTemplateColumns={{ lg: "280px 1fr" }} gap={8}>
          
          {/* SIDEBAR FILTRE */}
          <Box 
            bg={DS.colors.card} 
            p={6} 
            borderRadius="2xl" 
            border={DS.border}
            boxShadow={DS.shadow}
            position={{ lg: "sticky" }} 
            top={{ lg: "100px" }} // Păstrează sidebar-ul fix la scroll pe desktop
            h="fit-content"
            mb={{ base: 8, lg: 0 }}
          >
            <Flex align="center" gap={2} mb={6}>
              <FiFilter color={DS.colors.brand} />
              <Text color={DS.colors.text} fontWeight="800" fontSize="lg">Filtre</Text>
            </Flex>
            
            <Box w="100%" borderBottom="1px solid" borderColor="whiteAlpha.100" mb={6} />
            
            <VStack spacing={6} align="stretch">
              
              {/* Filtru: Locație */}
              <Box>
                <Text color={DS.colors.muted} mb={2} fontSize="xs" fontWeight="700" letterSpacing="0.5px">LOCAȚIE</Text>
                <Flex 
                  position="relative" 
                  bg={DS.colors.input} 
                  borderRadius="xl" 
                  h="44px" 
                  align="center" 
                  border="1px solid" 
                  borderColor="whiteAlpha.100" 
                  _focusWithin={{ borderColor: DS.colors.brand }}
                  transition={DS.transition}
                >
                  <Box
                    as="select"
                    w="full"
                    h="full"
                    px={4}
                    bg="transparent"
                    color={DS.colors.text}
                    fontSize="sm"
                    fontWeight="600"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    outline="none"
                    cursor="pointer"
                    appearance="none"
                  >
                    <option value="" style={{ background: DS.colors.card, color: DS.colors.text }}>Toate locațiile</option>
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc} style={{ background: DS.colors.card, color: DS.colors.text }}>
                        {loc}
                      </option>
                    ))}
                  </Box>
                  <Box position="absolute" right={4} pointerEvents="none" color={DS.colors.muted}>
                    <FiChevronDown size={16} />
                  </Box>
                </Flex>
              </Box>

              {/* Filtru: Sortare (Bonus) */}
              <Box>
                <Text color={DS.colors.muted} mb={2} fontSize="xs" fontWeight="700" letterSpacing="0.5px">SORTEAZĂ</Text>
                <Flex 
                  position="relative" 
                  bg={DS.colors.input} 
                  borderRadius="xl" 
                  h="44px" 
                  align="center" 
                  border="1px solid" 
                  borderColor="whiteAlpha.100" 
                  _focusWithin={{ borderColor: DS.colors.brand }}
                  transition={DS.transition}
                >
                  <Box
                    as="select"
                    w="full"
                    h="full"
                    px={4}
                    bg="transparent"
                    color={DS.colors.text}
                    fontSize="sm"
                    fontWeight="600"
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    outline="none"
                    cursor="pointer"
                    appearance="none"
                  >
                    <option value="" style={{ background: DS.colors.card, color: DS.colors.text }}>Recomandate</option>
                    <option value="asc" style={{ background: DS.colors.card, color: DS.colors.text }}>Preț: Crescător</option>
                    <option value="desc" style={{ background: DS.colors.card, color: DS.colors.text }}>Preț: Descrescător</option>
                  </Box>
                  <Box position="absolute" right={4} pointerEvents="none" color={DS.colors.muted}>
                    <FiChevronDown size={16} />
                  </Box>
                </Flex>
              </Box>

              <Button 
                w="100%" 
                h="48px"
                mt={4}
                bg={DS.colors.brand} 
                color={DS.colors.card} 
                fontWeight="800" 
                borderRadius="xl"
                _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                transition={DS.transition}
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
              {/* Am mai pus date o dată doar ca să umplem grila vizual pentru demo */}
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