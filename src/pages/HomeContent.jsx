import { Box, Flex, Icon, Input } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";
import { GiTennisRacket } from "react-icons/gi";

// Importuri
import SportCard from "../components/SportCard";
import VenueCard from "../components/VenueCard";
import Section from "../components/Section";
import ResponsiveCarousel from "../components/ResponsiveCarousel";
import { colors } from "./colors";

const DUMMY_VENUES = [
  { id: 1, title: "Baza sportiva Juventus Berceni", location: "Sector 4", price: "100RON/ora", rating: "4.6", image: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1173&auto=format&fit=crop" },
  { id: 2, title: "Baza sportiva Tineretului", location: "Sector 4", price: "150RON/ora", rating: "4.8", image: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1173&auto=format&fit=crop" },
];

const HomeContent = () => (
  <Box maxW="1400px" mx="auto">
    
    {/* AICI ESTE FIX-UL PENTRU SEARCH BAR */}
    <Flex 
      align="center" 
      bg={colors.bgCard} 
      borderRadius="xl" 
      px={5} 
      h="56px" 
      mb={10} 
      maxW="600px"
      border="1px solid transparent"
      transition="all 0.2s"
      _focusWithin={{ 
        borderColor: colors.accent, 
        boxShadow: `0 0 0 1px ${colors.accent}` 
      }}
    >
      <Icon as={FiSearch} color="gray.400" boxSize={5} mr={4} />
      <Input 
        placeholder="Caută terenuri, sporturi, locații..." 
        border="none" 
        bg="transparent"
        color={colors.textMain} 
        _focus={{ outline: "none", boxShadow: "none", border: "none" }} 
        _focusVisible={{ outline: "none", boxShadow: "none", border: "none" }} // Anulează ring-ul gri de la Chakra
      />
    </Flex>

    <Section title="Sporturi populare">
      <ResponsiveCarousel>
        <SportCard icon={FaFutbol} color="white" />
        <SportCard icon={FaBasketballBall} color="#F97316" />
        <SportCard icon={GiTennisRacket} color="#A855F7" />
      </ResponsiveCarousel>
    </Section>

    <Section title="Ce recomandam">
      <ResponsiveCarousel>
        {DUMMY_VENUES.map((v) => <VenueCard key={v.id} data={v} />)}
      </ResponsiveCarousel>
    </Section>
    
    <Section title="Populare acum">
      <ResponsiveCarousel>
        {DUMMY_VENUES.map((v) => <VenueCard key={`pop-${v.id}`} data={v} />)}
      </ResponsiveCarousel>
    </Section>
  </Box>
);

export default HomeContent;