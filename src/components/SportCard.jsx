import { Flex, Icon, Text, VStack } from "@chakra-ui/react";
import { colors } from "../pages/colors";

const SportCard = ({ icon: SportIcon, color, cardBg, label, size = "sm", onClick }) => {
  const isLarge = size === "lg";

  return (
    <Flex
      // Pe mobile se întinde 100% din coloana de Grid. Pe desktop are dimensiuni fixe și mari.
      w={isLarge ? { base: "100%", md: "240px", lg: "280px" } : { base: "90px", md: "110px" }}
      h={isLarge ? { base: "140px", md: "220px", lg: "260px" } : { base: "90px", md: "110px" }}
      bg={cardBg || colors.bgCard}
      borderRadius={isLarge ? { base: "2xl", md: "3xl", lg: "4xl" } : "2xl"}
      justifyContent="center"
      alignItems="center"
      flexShrink={0}
      cursor="pointer"
      onClick={onClick} // Acțiunea de navigare la click
      transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
      boxShadow={isLarge ? "0 8px 20px rgba(0,0,0,0.15)" : "none"}
      _hover={{ 
        transform: "translateY(-8px)", 
        filter: cardBg ? "brightness(1.15)" : "none", 
        boxShadow: isLarge ? "0 15px 30px rgba(0,0,0,0.3)" : "none",
        bg: !cardBg ? "#2A2D34" : cardBg 
      }}
    >
      {label ? (
        <VStack spacing={{ base: 3, md: 5 }}>
          <Icon
            as={SportIcon}
            // Iconițe și mai mari pe desktop pentru a umple cardul
            boxSize={{ base: 12, md: 20, lg: 24 }}
            color={color || "white"}
            filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.3))" 
          />
          <Text 
            color="white" 
            fontWeight="700" 
            // Text vizibil mai mare
            fontSize={{ base: "md", md: "xl", lg: "2xl" }}
            letterSpacing="wide"
            textAlign="center"
          >
            {label}
          </Text>
        </VStack>
      ) : (
        <Icon
          as={SportIcon}
          boxSize={{ base: 10, md: 12 }}
          color={color || "white"}
        />
      )}
    </Flex>
  );
};

export default SportCard;