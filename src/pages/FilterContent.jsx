import { Box, Text, Button } from "@chakra-ui/react";
import { colors } from "./colors";
import FilterVenueCard from "../components/FilterVenueCard";
import { useParams } from "react-router-dom";

const FilterContent = () => {
  const { sportType } = useParams();
  const title = sportType ? sportType.charAt(0).toUpperCase() + sportType.slice(1) : "Sport";

  return (
    <Box maxW="1200px" mx="auto" pt={4}>
      <Text fontSize="2xl" fontWeight="800" color="white" mb={8}>
        Terenuri de {title}
      </Text>

      <Box display={{ base: "block", lg: "grid" }} gridTemplateColumns={{ lg: "280px 1fr" }} gap={8}>
        <Box bg={colors.bgCard} p={6} borderRadius="2xl" position="sticky" top="20px">
          <Text color={colors.accent} fontWeight="700" mb={6}>Filtre</Text>
          <Box w="100%" borderBottom="1px solid" borderColor="whiteAlpha.200" mb={6} />
          
          <Box w="100%" mb={4}>
            <Text color="white" mb={2} fontSize="sm">Localitate</Text>
            {/* Fix pentru eroarea Select din Chakra v3 */}
            <Box as="select" bg={colors.bgMain} border="none" color="gray.300" w="100%" p={3} borderRadius="md">
              <option style={{ background: colors.bgMain }}>București</option>
            </Box>
          </Box>

          <Button w="100%" bg={colors.accent} color="black">Aplică Filtre</Button>
        </Box>

        <Box display="grid" gridTemplateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap={6}>
          {/* Aici mapezi DUMMY_DATA cu FilterVenueCard */}
        </Box>
      </Box>
    </Box>
  );
};

export default FilterContent;