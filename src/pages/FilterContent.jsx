import { Box, Text, Button } from "@chakra-ui/react"; // Am șters Select din import
import { colors } from "./colors";
import FilterVenueCard from "../components/FilterVenueCard";
// Nu mai avem nevoie de useParams momentan dacă o apelăm din UserPage

const DUMMY_DATA = [
  { id: 1, title: "Arena Nationala - Teren 1", location: "Sector 2", price: "150 RON/ora", rating: "4.9", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, title: "Complex Sportiv Steaua", location: "Sector 6", price: "120 RON/ora", rating: "4.7", image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1200&auto=format&fit=crop" },
];

const FilterContent = ({ sport }) => {
  // Formatăm textul frumos (ex: "fotbal" -> "Fotbal")
  const title = sport
    ? sport.charAt(0).toUpperCase() + sport.slice(1)
    : "Sport";

  return (
    <Box maxW="1200px" mx="auto" pt={4}>
      <Box mb={8} display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize="2xl" fontWeight="800" color="white">
          Terenuri de {title}
        </Text>
      </Box>

      <Box display={{ base: "block", lg: "grid" }} gridTemplateColumns={{ lg: "280px 1fr" }} gap={8}>
        <Box bg={colors.bgCard} p={6} borderRadius="2xl" position="sticky" top="20px">
          <Box mb={6} display="flex" alignItems="center" gap={3} color={colors.accent}>
            <Text fontWeight="700">Filtre</Text>
          </Box>
          <Box w="100%" borderBottom="1px solid" borderColor="whiteAlpha.200" mb={6} />

          <Box w="100%" mb={4}>
            <Text color="white" mb={2} fontSize="sm">
              Localitate
            </Text>
            {/* FIX PENTRU EROAREA TA: Folosim un Box transformat în select */}
            <Box 
              as="select" 
              bg={colors.bgMain} 
              border="none" 
              color="gray.300"
              w="100%"
              p={3}
              borderRadius="md"
              outline="none"
              cursor="pointer"
            >
              <option style={{ background: colors.bgMain }}>București</option>
            </Box>
          </Box>

          <Button w="100%" bg={colors.accent} color="black" _hover={{ opacity: 0.9 }}>
            Aplică Filtre
          </Button>
        </Box>

        <Box display="grid" gridTemplateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
          {DUMMY_DATA.map((v) => (
            <FilterVenueCard key={v.id} data={v} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FilterContent;