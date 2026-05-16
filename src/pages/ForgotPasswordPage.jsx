import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Flex,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { colors } from "./colors";

const AUTH_API_URL =
  import.meta.env.VITE_SECURITY_SERVICE_URL || "http://localhost:8080/api/auth";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const bgCard = colors?.bgCard || "#16181C";
  const accent = colors?.accent || "#5ED1BE";

  const handleSendEmail = async () => {
    if (!email) {
      setError("Te rugăm să introduci adresa de email.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      if (!response.ok) throw new Error("Eroare la procesarea cererii.");

      setSuccess(
        "Dacă emailul există în sistem, ai primit un cod de recuperare.",
      );
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("A apărut o problemă. Te rugăm să încerci din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = () => {
    console.log("Validare cod:", code);
  };

  return (
    <Flex
      justifyContent="center"
      align="center"
      position="relative"
      zIndex={2}
      w="full"
    >
      <Box
        p={10}
        bg={bgCard}
        borderRadius="3xl"
        w={{ base: "90%", md: "400px" }}
        border={`1px solid ${accent}22`}
        boxShadow="0 20px 40px rgba(0,0,0,0.4)"
      >
        <VStack spacing={6}>
          <Heading color="white" size="md">
            Recuperare Parolă
          </Heading>

          {error && (
            <Box
              bg="rgba(255, 95, 95, 0.1)"
              w="100%"
              p={3}
              borderRadius="lg"
              border="1px solid rgba(255, 95, 95, 0.3)"
            >
              <Text
                color="#FF5F5F"
                fontSize="sm"
                textAlign="center"
                fontWeight="bold"
              >
                {error}
              </Text>
            </Box>
          )}

          {success && step === 2 && (
            <Box
              bg="rgba(94, 209, 190, 0.1)"
              w="100%"
              p={3}
              borderRadius="lg"
              border={`1px solid ${accent}`}
            >
              <Text
                color={accent}
                fontSize="sm"
                textAlign="center"
                fontWeight="bold"
              >
                {success}
              </Text>
            </Box>
          )}

          {step === 1 ? (
            <>
              <Text color="gray.400" textAlign="center" fontSize="sm">
                Introdu adresa de email pentru a primi codul de securitate.
              </Text>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemplu.com"
                type="email"
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
                color="white"
                h="50px"
                borderRadius="xl"
                _focus={{ borderColor: accent, boxShadow: "none" }}
              />
              <Button
                w="100%"
                bg={accent}
                color="black"
                h="50px"
                borderRadius="xl"
                fontWeight="bold"
                isLoading={isLoading}
                onClick={handleSendEmail}
              >
                Trimite Cod
              </Button>
            </>
          ) : (
            <>
              <Text color="gray.400" textAlign="center" fontSize="sm">
                Introdu codul primit pe email.
              </Text>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={4}
                placeholder="0000"
                textAlign="center"
                fontSize="2xl"
                letterSpacing="0.5em"
                fontWeight="bold"
                bg="whiteAlpha.50"
                border="1px solid"
                borderColor="whiteAlpha.100"
                color="white"
                h="60px"
                borderRadius="xl"
                _focus={{ borderColor: accent, boxShadow: "none" }}
              />
              <Button
                w="100%"
                bg={accent}
                color="black"
                h="50px"
                borderRadius="xl"
                fontWeight="bold"
                onClick={handleVerifyCode}
              >
                Verifică Codul
              </Button>
            </>
          )}

          <Box
            as={RouterLink}
            to="/"
            color="gray.400"
            fontSize="sm"
            mt={2}
            _hover={{ color: "white" }}
          >
            Înapoi la{" "}
            <Text as="span" color={accent} fontWeight="bold">
              Conectare
            </Text>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ForgotPasswordPage;
