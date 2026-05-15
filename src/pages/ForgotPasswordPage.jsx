import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Button, Input, VStack, Heading, Text, Flex } from "@chakra-ui/react";
import { colors } from "./colors";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  
  const bgMain = colors?.bgMain || "#0B0C10";
  const bgCard = colors?.bgCard || "#16181C";
  const accent = colors?.accent || "#5ED1BE";

  return (
    // Am scos Containerul mare si bgMain. Am lasat doar cardul.
    <Flex justifyContent="center" align="center" position="relative" zIndex={2}>
      <Box p={10} bg={bgCard} borderRadius="3xl" w={{ base: "90%", md: "400px" }} border={`1px solid ${accent}22`} boxShadow="0 20px 40px rgba(0,0,0,0.4)">
        <VStack spacing={6}>
          <Heading color="white" size="md">Recuperare Parolă</Heading>
          {step === 1 ? (
            <><Text color="gray.400" textAlign="center" fontSize="sm">Introdu adresa de email pentru a primi codul.</Text><Input placeholder="email@exemplu.com" bg={bgMain} border="1px solid" borderColor="whiteAlpha.100" color="white" h="50px" borderRadius="xl" _focus={{ borderColor: accent, boxShadow: "none" }} /><Button w="100%" bg={accent} color="black" h="50px" borderRadius="xl" fontWeight="bold" onClick={() => setStep(2)}>Trimite Cod</Button></>
          ) : (
            <><Text color="gray.400" textAlign="center" fontSize="sm">Introdu codul primit pe email.</Text><Input value={code} onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))} maxLength={4} placeholder="0000" textAlign="center" fontSize="2xl" letterSpacing="0.5em" fontWeight="bold" bg={bgMain} border="1px solid" borderColor="whiteAlpha.100" color="white" h="60px" borderRadius="xl" _focus={{ borderColor: accent, boxShadow: "none" }} /><Button w="100%" bg={accent} color="black" h="50px" borderRadius="xl" fontWeight="bold" onClick={() => navigate("/?view=change")}>Verifică Cod</Button></>
          )}
          <Box as={RouterLink} to="/" color="gray.400" fontSize="sm" _hover={{ color: "white" }}>Înapoi la Autentificare</Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ForgotPasswordPage;