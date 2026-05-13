// src/components/Navigation.jsx
import React from "react";
import { Box, Flex, VStack, Icon, Text } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { colors } from "../pages/colors";

export const Navigation = ({ navItems, basePath, title = "SportApp." }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detectăm automat tab-ul activ din URL (ex: din "/user/search" extragem "search")
  const activeTab = location.pathname.split("/").pop() || "home";

  return (
    <>
      {/* Sidebar - Desktop */}
      <Box
        display={{ base: "none", md: "block" }}
        w="260px"
        h="100vh"
        bg={colors.bgCard}
        position="fixed"
        left={0}
        top={0}
        p={6}
        zIndex={10}
      >
        <Text color={colors.accent} fontSize="2xl" fontWeight="900" mb={12}>
          {title}
        </Text>
        <VStack spacing={4} align="stretch">
          {navItems.map((item) => (
            <Flex
              key={item.id}
              align="center"
              p={4}
              borderRadius="xl"
              cursor="pointer"
              color={activeTab === item.id ? colors.accent : "gray.400"}
              // Navigăm dinamic pe baza rolului (ex: /user/search sau /admin/users)
              onClick={() => navigate(`${basePath}/${item.id}`)}
              _hover={{ bg: "rgba(94, 209, 190, 0.05)", color: colors.accent }}
              transition="all 0.2s"
            >
              <Icon as={item.icon} boxSize={5} mr={4} />
              <Text fontSize="md" fontWeight="600">
                {item.label}
              </Text>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Mobile Nav - Bottom */}
      <Box
        display={{ base: "block", md: "none" }}
        position="fixed"
        bottom={0}
        left={0}
        w="100%"
        bg={colors.bgMain}
        borderTop={`1px solid ${colors.bgCard}`}
        zIndex={10}
      >
        <Flex justifyContent="space-around" alignItems="center">
          {navItems.map((item) => (
            <VStack
              key={item.id}
              w="100%"
              py={3}
              spacing={1}
              cursor="pointer"
              color={activeTab === item.id ? colors.accent : "gray.500"}
              onClick={() => navigate(`${basePath}/${item.id}`)}
            >
              <Icon as={item.icon} boxSize={6} />
              <Text fontSize="xs">{item.label}</Text>
            </VStack>
          ))}
        </Flex>
      </Box>
    </>
  );
};
