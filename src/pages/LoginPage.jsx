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

// Importăm paginile tale separate
import RegisterPage from "./RegisterPage";
import ForgotPasswordPage from "./ForgotPasswordPage";
import ChangePasswordPage from "./ChangePasswordPage";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const view = searchParams.get("view");

  const bgMain = colors?.bgMain || "#0B0C10";
  const bgCard = colors?.bgCard || "#16181C";
  const accent = colors?.accent || "#5ED1BE";

  // Logica de login neatinsă
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "user" && password === "user") {
      onLogin({ name: "Mihai", role: "user" });
      navigate("/user/home");
    } else if (username === "admin" && password === "admin") {
      onLogin({ name: "Boss Admin", role: "admin" });
      navigate("/admin");
    } else if (username === "baza" && password === "baza") {
      onLogin({ name: "Complex Sportiv", role: "baza" });
      navigate("/baza");
    } else {
      setError("Utilizator sau parolă incorectă!");
    }
  };

  // Funcție pentru a randa conținutul în funcție de view (transparente acum)
  const renderContent = () => {
    if (view === "register") return <RegisterPage />;
    if (view === "forgot") return <ForgotPasswordPage />;
    if (view === "change") return <ChangePasswordPage />;

    // Interfața de Login implicită
    return (
      <Box
        p={10}
        bg={bgCard}
        borderRadius="3xl"
        boxShadow="0 20px 40px rgba(0,0,0,0.5)"
        border={`1px solid ${accent}22`}
        w={{ base: "90%", md: "400px" }}
        position="relative"
        zIndex={2}
      >
        <form onSubmit={handleLogin}>
          <VStack spacing={6}>
            <VStack spacing={1} mb={4}>
              <Heading color="white" size="xl">
                ArenaTracker
              </Heading>
              <Text color="gray.400">Bine ai revenit!</Text>
            </VStack>
            <VStack spacing={4} w="100%">
              <Box w="100%">
                <Text color="gray.400" mb={1} fontSize="xs" fontWeight="bold">
                  EMAIL
                </Text>
                <Input
                  placeholder="Introdu email"
                  bg={bgMain}
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  color="white"
                  h="50px"
                  borderRadius="xl"
                  _focus={{ borderColor: accent, boxShadow: "none" }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Box>
              <Box w="100%">
                <Text color="gray.400" mb={1} fontSize="xs" fontWeight="bold">
                  PAROLA
                </Text>
                <Input
                  placeholder="Introdu parola"
                  type="password"
                  bg={bgMain}
                  border="1px solid"
                  borderColor="whiteAlpha.100"
                  color="white"
                  h="50px"
                  borderRadius="xl"
                  _focus={{ borderColor: accent, boxShadow: "none" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Flex justify="flex-end" mt={2}>
                  <Box
                    as={RouterLink}
                    to="/?view=forgot"
                    color={accent}
                    fontSize="sm"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Ai uitat parola?
                  </Box>
                </Flex>
              </Box>
            </VStack>
            {error && (
              <Text color="red.400" fontSize="sm">
                {error}
              </Text>
            )}
            <Button
              type="submit"
              w="100%"
              bg={accent}
              color="black"
              h="50px"
              borderRadius="xl"
              fontWeight="bold"
              _hover={{ opacity: 0.9 }}
            >
              Autentificare
            </Button>
            <Text color="gray.400" fontSize="sm">
              Nu ai cont?{" "}
              <Box
                as={RouterLink}
                to="/?view=register"
                color={accent}
                fontWeight="bold"
                display="inline-block"
                _hover={{ textDecoration: "underline" }}
              >
                Creează-ți!
              </Box>
            </Text>
          </VStack>
        </form>
      </Box>
    );
  };

  return (
    // Acesta este Containerul mare cu fundalul metalic și efectele neon
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
      {/* Decorative Fixed Blur Blobs (Efectele neon cum sunt pe tot user-ul) */}
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
        filter="blur(100px)"
        zIndex="0"
        pointerEvents="none"
      />

      {/* Conținutul paginii */}
      <Flex
        w="100%"
        h="100%"
        justify="center"
        align="center"
        position="relative"
        zIndex={2}
        p={10}
      >
        {renderContent()}
      </Flex>
    </Container>
  );
};

export default LoginPage;
