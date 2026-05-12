import { Box, Text } from "@chakra-ui/react";

function BazaPage() {
  return (
    <Box p={10} color="white">
      <Text fontSize="3xl" fontWeight="bold" mb={4}>
        Pagina Bază Sportivă
      </Text>
      <Text>Aici poți administra terenurile și rezervările bazei sportive.</Text>
    </Box>
  );
}

export default BazaPage;
