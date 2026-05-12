// src/components/Navigation.jsx
import React from "react";
import { Box, Flex, VStack, Icon, Text } from "@chakra-ui/react";
import { colors } from "../pages/colors";

export const Navigation = ({
  activeTab,
  onTabChange,
  navItems,
  title = "SportApp.",
}) => {
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
        borderRight={`1px solid ${colors.bgMain}`}
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
              bg={
                activeTab === item.id
                  ? "rgba(94, 209, 190, 0.1)"
                  : "transparent"
              }
              color={activeTab === item.id ? colors.accent : "gray.400"}
              onClick={() => {
                onTabChange(item.id);
                console.log(`Sunt pe butonul cu id:${item.id}`);
              }}
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
              color={activeTab === item.id ? colors.accent : "gray.500"}
              borderTop={
                activeTab === item.id
                  ? `2px solid ${colors.accent}`
                  : "2px solid transparent"
              }
              cursor="pointer"
              onClick={() => onTabChange(item.id)}
              transition="all 0.2s"
            >
              <Icon as={item.icon} boxSize={5} />
              <Text fontSize="10px" fontWeight="500">
                {item.label}
              </Text>
            </VStack>
          ))}
        </Flex>
      </Box>
    </>
  );
};
