import React from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Button, Input, VStack, Heading, Text, SimpleGrid, Flex } from "@chakra-ui/react";
import { colors } from "./colors";

const RegisterPage = () => {
  const navigate = useNavigate();
  const bgMain = colors?.bgMain || "#0B0C10";
  const bgCard = colors?.bgCard || "#16181C";
  const accent = colors?.accent || "#5ED1BE";
  
  const handleRegister = (e) => { e.preventDefault(); navigate("/"); };

  const inputStyles = {
    bg: bgMain, border: "1px solid", borderColor: "whiteAlpha.100",
    color: "white", h: "55px", borderRadius: "xl", px: 4,
    _focus: { borderColor: accent, boxShadow: "none" }
  };

  return (
    // Am scos Containerul mare si bgMain. Am lasat doar cardul.
    <Flex py={12} justifyContent="center" align="center" position="relative" zIndex={2}>
      <Box p={{ base: 8, md: 12 }} bg={bgCard} borderRadius="3xl" border={`1px solid ${accent}22`} w={{ base: "95%", md: "650px" }} boxShadow="0 20px 40px rgba(0,0,0,0.5)">
        <VStack spacing={8} as="form" onSubmit={handleRegister} w="100%">
          <VStack spacing={2} mb={2}><Heading color="white" size="xl" letterSpacing="tight">Creează Cont</Heading><Text color="gray.400" fontSize="md">Alătură-te comunității noastre</Text></VStack>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacingX={6} spacingY={6} w="100%">
            <Box><Text color="gray.400" mb={2} fontSize="xs" fontWeight="bold" letterSpacing="wide">NUME</Text><Input placeholder="Popescu" {...inputStyles} /></Box>
            <Box><Text color="gray.400" mb={2} fontSize="xs" fontWeight="bold" letterSpacing="wide">PRENUME</Text><Input placeholder="Ion" {...inputStyles} /></Box>
            <Box><Text color="gray.400" mb={2} fontSize="xs" fontWeight="bold" letterSpacing="wide">EMAIL</Text><Input placeholder="ion@exemplu.com" type="email" {...inputStyles} /></Box>
            <Box><Text color="gray.400" mb={2} fontSize="xs" fontWeight="bold" letterSpacing="wide">TELEFON</Text><Input placeholder="07XX XXX XXX" {...inputStyles} /></Box>
            <Box><Text color="gray.400" mb={2} fontSize="xs" fontWeight="bold" letterSpacing="wide">USERNAME</Text><Input placeholder="ionpopescu99" {...inputStyles} /></Box>
            <Box><Text color="gray.400" mb={2} fontSize="xs" fontWeight="bold" letterSpacing="wide">PAROLĂ</Text><Input placeholder="••••••••" type="password" {...inputStyles} /></Box>
          </SimpleGrid>
          <Button type="submit" w="100%" bg={accent} color="black" h="60px" borderRadius="xl" fontWeight="bold" fontSize="md" mt={4} _hover={{ opacity: 0.9 }}>Finalizează Înregistrarea</Button>
          <Box as={RouterLink} to="/" color="gray.400" fontSize="sm" mt={2} _hover={{ color: "white" }}>Ai deja cont? <Text as="span" color={accent} fontWeight="bold">Autentifică-te</Text></Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default RegisterPage;