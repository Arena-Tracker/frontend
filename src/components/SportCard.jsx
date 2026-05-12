import React from "react";
import { Flex, Icon } from "@chakra-ui/react";
import { colors } from "../pages/colors";

const SportCard = ({ icon: SportIcon, color }) => (
  <Flex
    minW={{ base: "90px", md: "110px" }}
    h={{ base: "90px", md: "110px" }}
    bg={colors.bgCard}
    borderRadius="2xl"
    justifyContent="center"
    alignItems="center"
    flexShrink={0}
    cursor="pointer"
    transition="all 0.2s"
    _hover={{ transform: "translateY(-4px)", bg: "#2A2D34" }}
  >
    <Icon
      as={SportIcon}
      boxSize={{ base: 10, md: 12 }}
      color={color || "white"}
    />
  </Flex>
);

export default SportCard;
