import React from "react";
import { Flex } from "@chakra-ui/react";
import { colors } from "../pages/colors";

const ResponsiveCarousel = ({ children }) => (
  <Flex
    overflowX="auto"
    gap={6}
    pb={4}
    // FIX PENTRU ANIMAȚIE: Adăugăm padding sus ca să aibă loc butonul să se ridice, 
    // și margin top negativ ca să nu strice spațierea din Homepage
    pt="12px" 
    mt="-12px"
    css={{
      "&::-webkit-scrollbar": { height: "6px", display: "none" },
      "@media (min-width: 768px)": {
        "&::-webkit-scrollbar": { display: "block" },
      },
      "&::-webkit-scrollbar-track": { background: "transparent" },
      "&::-webkit-scrollbar-thumb": {
        background: colors.bgCard,
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-thumb:hover": { background: colors.accent },
      scrollbarWidth: "auto",
    }}
  >
    {children}
  </Flex>
);

export default ResponsiveCarousel;