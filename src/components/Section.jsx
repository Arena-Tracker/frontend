import { Box, Text } from "@chakra-ui/react";
import { colors } from "../pages/colors";

const Section = ({ title, children }) => (
  <Box mb={10}>
    <Text
      fontSize={{ base: "xl", md: "2xl" }}
      fontWeight="700"
      color={colors.textMain}
      mb={6}
    >
      {title}
    </Text>
    {children}
  </Box>
);

export default Section;
