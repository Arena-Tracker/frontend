import { Box, Image, Text, Flex, VStack, HStack, Icon } from "@chakra-ui/react";
import { MdLocationOn } from "react-icons/md";
import { AiFillStar } from "react-icons/ai";
import { IoTicketOutline } from "react-icons/io5";
import { colors } from "../pages/colors";

const FilterVenueCard = ({ data }) => (
  <Box
    w="100%" // Se adaptează coloanei de grid
    bg={colors.bgCard}
    borderRadius="2xl"
    overflow="hidden"
    cursor="pointer"
    transition="all 0.2s"
    _hover={{ transform: "translateY(-6px)", boxShadow: "0 10px 20px rgba(0,0,0,0.4)" }}
  >
    <Image src={data.image} alt={data.title} h="200px" w="100%" objectFit="cover" />
    <Box p={5}>
      <Text color={colors.textMain} fontWeight="600" fontSize="lg" noOfLines={1} mb={4}>{data.title}</Text>
      <Flex justifyContent="space-between" alignItems="flex-end">
        <VStack align="start" spacing={2} fontSize="sm">
          <HStack color="gray.400"><Icon as={MdLocationOn} /><Text>{data.location}</Text></HStack>
          <HStack color={colors.accent} fontWeight="600"><Icon as={IoTicketOutline} /><Text>{data.price}</Text></HStack>
        </VStack>
        <HStack color={colors.textMain} fontWeight="700" bg="#16181C" px={3} py={1} borderRadius="lg">
          <Text>{data.rating}</Text><Icon as={AiFillStar} color="#FBBF24" />
        </HStack>
      </Flex>
    </Box>
  </Box>
);

export default FilterVenueCard;