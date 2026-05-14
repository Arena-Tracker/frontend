import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Input, VStack, Heading, Flex } from "@chakra-ui/react";
import { colors } from "./colors";

const ChangePasswordPage = () => {
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const navigate = useNavigate();

  const bgMain = colors?.bgMain || "#0B0C10";
  const bgCard = colors?.bgCard || "#16181C";
  const accent = colors?.accent || "#5ED1BE";

  const handleReset = () => { if (p1 === p2 && p1 !== "") { navigate("/"); } };

  return (
    // Am scos Containerul mare si bgMain. Am lasat doar cardul.
    <Flex justifyContent="center" align="center" position="relative" zIndex={2}>
      <Box p={10} bg={bgCard} borderRadius="3xl" w={{ base: "90%", md: "400px" }} border={`1px solid ${accent}22`} boxShadow="0 20px 40px rgba(0,0,0,0.4)">
        <VStack spacing={6}>
          <Heading color="white" size="md">Noua Parolă</Heading>
          <Input placeholder="Parola nouă" type="password" value={p1} onChange={(e) => setP1(e.target.value)} bg={bgMain} border="1px solid" borderColor="whiteAlpha.100" color="white" h="50px" borderRadius="xl" _focus={{ borderColor: accent, boxShadow: "none" }} />
          <Input placeholder="Confirmă parola" type="password" value={p2} onChange={(e) => setP2(e.target.value)} bg={bgMain} border="1px solid" borderColor="whiteAlpha.100" color="white" h="50px" borderRadius="xl" _focus={{ borderColor: accent, boxShadow: "none" }} />
          <Button w="100%" bg={accent} color="black" h="50px" borderRadius="xl" fontWeight="bold" onClick={handleReset}>Schimbă Parola</Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ChangePasswordPage;