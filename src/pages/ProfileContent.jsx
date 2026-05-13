// src/pages/ProfileContent.jsx
import React from "react";
import { Box, Text, VStack, Heading, Icon } from "@chakra-ui/react";
import { FiUser } from "react-icons/fi"; // Folosim un icon în loc de Avatar
import { colors } from "./colors";

const ProfileContent = () => {
  return (
    <Box p={8} bg={colors.bgCard} borderRadius="2xl" color="white">
      <VStack spacing={6} align="center">
        {/* Placeholder pentru poza de profil */}
        <Box p={4} bg="whiteAlpha.200" borderRadius="full">
          <Icon as={FiUser} boxSize={10} color={colors.accent} />
        </Box>

        <VStack spacing={1}>
          <Heading size="lg">Profilul Meu</Heading>
          <Text color="gray.400">test@example.com</Text>
        </VStack>

        <Box
          w="full"
          p={4}
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="md"
        >
          <Text fontWeight="bold">Secțiune în lucru (Girip)</Text>
          <Text fontSize="sm">
            Aici vor apărea setările și datele utilizatorului.
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default ProfileContent;
