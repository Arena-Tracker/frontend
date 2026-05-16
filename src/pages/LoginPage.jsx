import React, { useState } from "react";
import {
  useNavigate,
  useSearchParams,
  Link as RouterLink,
} from "react-router-dom";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Container,
  Flex,
} from "@chakra-ui/react";
import { colors } from "./colors";

import RegisterPage from "./RegisterPage";
import ForgotPasswordPage from "./ForgotPasswordPage";

const AUTH_API_URL =
  import.meta.env.VITE_SECURITY_SERVICE_URL || "http://localhost:8080/api/auth";

// FUNCȚIE UTILITARĂ PENTRU DECODARE JWT NATIVĂ
const decodeToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("0" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  const bgMain = colors?.bgMain || "#0B0C10";
  const bgCard = colors?.bgCard || "#16181C";
  const accent = colors?.accent || "#5ED1BE";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!response.ok) {
        throw new Error("Email sau parolă incorectă!");
      }

      const data = await response.json(); // Se așteaptă AuthResponse { token, role }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Decodăm token-ul pentru a scoate ID-ul utilizatorului trimis de backend
      const decoded = decodeToken(data.token);
      const userId = decoded
        ? decoded.id || decoded.userId || decoded.idUser
        : 1;

      // Salvăm în state-ul global id-ul real și rolul
      onLogin({ id: userId, role: data.role });

      // REDIRECȚIONARE CORECTĂ CONFORM RUTELOR DIN APP.JSX
      if (data.role === "BAZA_SPORTIVA" || data.role === "ADMIN") {
        navigate("/baza/terenuri");
      } else {
        navigate("/user/home");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Eroare la conectare. Încearcă din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  if (view === "register") return <RegisterPage />;
  if (view === "forgot") return <ForgotPasswordPage />;

  return (
    <Container
      maxW="100vw"
      minH="100vh"
      centerContent
      justifyContent="center"
      bg={bgMain}
      p={0}
      position="relative"
      overflow="auto"
    >
      <Box
        position="fixed"
        top="-10%"
        left="-15%"
        w="50vw"
        h="50vw"
        maxW="800px"
        maxH="800px"
        bg={`${accent}10`}
        borderRadius="full"
        filter="blur(80px)"
        zIndex="0"
        pointerEvents="none"
      />
      <Box
        position="fixed"
        bottom="-15%"
        right="-10%"
        w="40vw"
        h="40vw"
        maxW="600px"
        maxH="600px"
        bg={`${accent}05`}
        borderRadius="full"
        filter="blur(80px)"
        zIndex="0"
        pointerEvents="none"
      />

      <Box
        position="relative"
        zIndex={2}
        w="100%"
        maxW="400px"
        bg={bgCard}
        p={8}
        borderRadius="3xl"
        boxShadow="0 20px 40px rgba(0,0,0,0.4)"
        border={`1px solid ${accent}22`}
      >
        <form onSubmit={handleLogin}>
          <VStack spacing={6}>
            <VStack spacing={2}>
              <Heading
                color="white"
                size="lg"
                fontWeight="900"
                letterSpacing="-0.5px"
              >
                Bine ai venit!
              </Heading>
              <Text color="gray.400" fontSize="sm">
                Loghează-te pentru a continua.
              </Text>
            </VStack>

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

            <VStack spacing={4} w="100%">
              <Box w="100%">
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="gray.400"
                  mb={1}
                  textTransform="uppercase"
                >
                  Email
                </Text>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@exemplu.ro"
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  color="white"
                  h="50px"
                  borderRadius="xl"
                  _focus={{
                    borderColor: accent,
                    boxShadow: "none",
                    bg: "whiteAlpha.100",
                  }}
                  _placeholder={{ color: "whiteAlpha.300" }}
                  required
                />
              </Box>
              <Box w="100%">
                <Flex justify="space-between" align="center" mb={1}>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.400"
                    textTransform="uppercase"
                  >
                    Parolă
                  </Text>
                  <Box
                    as={RouterLink}
                    to="/?view=forgot"
                    color={accent}
                    fontSize="xs"
                    fontWeight="bold"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Ai uitat parola?
                  </Box>
                </Flex>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  bg="whiteAlpha.50"
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  color="white"
                  h="50px"
                  borderRadius="xl"
                  _focus={{
                    borderColor: accent,
                    boxShadow: "none",
                    bg: "whiteAlpha.100",
                  }}
                  _placeholder={{ color: "whiteAlpha.300" }}
                  required
                />
              </Box>
            </VStack>

            <Button
              type="submit"
              w="100%"
              bg={accent}
              color="black"
              h="50px"
              borderRadius="xl"
              fontWeight="black"
              fontSize="md"
              _hover={{
                opacity: 0.9,
                transform: "translateY(-2px)",
                boxShadow: `0 10px 20px -10px ${accent}`,
              }}
              transition="all 0.2s"
              mt={2}
              isLoading={isLoading}
              loadingText="Se conectează..."
            >
              Conectare
            </Button>
            <Text color="gray.400" fontSize="sm">
              Nu ai cont?{" "}
              <Box
                as={RouterLink}
                to="/?view=register"
                color={accent}
                fontWeight="bold"
                _hover={{ textDecoration: "underline" }}
              >
                Creează-ți!
              </Box>
            </Text>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
