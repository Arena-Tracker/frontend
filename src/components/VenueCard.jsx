import React from "react";
import { Box, Image, Text, Flex, VStack, HStack, Icon } from "@chakra-ui/react";
import { MdLocationOn } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import { IoTicketOutline } from "react-icons/io5";
import { colors } from "../pages/colors";

const VenueCard = ({ data }) => (
  <Box
    minW={{ base: "260px", md: "320px" }}
    bg={colors.bgCard}
    borderRadius="2xl"
    overflow="hidden"
    flexShrink={0}
    cursor="pointer"
    transition="all 0.2s"
    _hover={{
      transform: "translateY(-6px)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
    }}
  >
    <Image
      src={data.image}
      alt={data.title}
      h={{ base: "160px", md: "180px" }}
      w="100%"
      objectFit="cover"
    />
    <Box p={5}>
      <Text
        color={colors.textMain}
        fontWeight="600"
        fontSize="lg"
        noOfLines={2}
        mb={4}
        lineHeight="tight"
      >
        {data.title}
      </Text>
      <Flex justifyContent="space-between" alignItems="flex-end">
        <VStack align="start" spacing={2} fontSize="sm">
          <HStack color="gray.400">
            <Icon as={MdLocationOn} />
            <Text>{data.location}</Text>
          </HStack>
          <HStack color={colors.accent} fontWeight="500">
            <Icon as={IoTicketOutline} />
            <Text fontSize="md">{data.price}</Text>
          </HStack>
        </VStack>
        <HStack
          color={colors.textMain}
          fontSize="md"
          fontWeight="600"
          bg="#16181C"
          px={2}
          py={1}
          borderRadius="md"
        >
          <Text>{data.rating}</Text>
          <Icon as={AiFillStar} color="#FBBF24" />
        </HStack>
      </Flex>
    </Box>
  </Box>
);

export default VenueCard;
