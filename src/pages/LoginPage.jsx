import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Container,
} from "@chakra-ui/react";

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Verificare conturi hardcodate
    if (username === "user" && password === "user") {
      onLogin({ name: "Mihai", role: "user" });
      navigate("/user");
    } else if (username === "admin" && password === "admin") {
      onLogin({ name: "Boss Admin", role: "admin" });
      navigate("/admin");
    } else if (username === "baza" && password === "baza") {
      onLogin({ name: "Complex Sportiv", role: "baza" });
      navigate("/bazasportiva");
    } else {
      setError("Utilizator sau parolă incorectă!");
    }
  };

  return (
    <Container maxW="md" py={20}>
      <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="md">
        <form onSubmit={handleLogin}>
          <VStack gap={4}>
            <Heading size="lg">Autentificare</Heading>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Text color="red.500">{error}</Text>}
            <Button colorPalette="purple" type="submit" width="full">
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default LoginPage;
