import { Box, Text } from "@chakra-ui/react";

function AdminPage() {
  return (
    <Box p={10} color="white">
      <Text fontSize="3xl" fontWeight="bold" mb={4}>
        Pagina Admin
      </Text>
      <Text>Accesează zonele de administrare din aplicație.</Text>
    </Box>
  );
}

export default AdminPage;
