import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Flex,
  Container,
} from "@chakra-ui/react";
import { colors } from "./colors";

let AUTH_API_URL =
  import.meta.env.VITE_SECURITY_SERVICE_URL || "http://localhost:8085/api/auth";
if (AUTH_API_URL.endsWith("/api")) {
  AUTH_API_URL += "/auth";
}

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i < 10 ? `0${i}` : `${i}`;
  return `${hour}:00`;
});

const ORAS_ENUM = [
  "BUCURESTI_SECTOR1",
  "BUCURESTI_SECTOR2",
  "BUCURESTI_SECTOR3",
  "BUCURESTI_SECTOR4",
  "BUCURESTI_SECTOR5",
  "BUCURESTI_SECTOR6",
  "BUFTEA",
  "CHITILA",
  "MAGURELE",
  "OTOPENI",
  "PANTELIMON",
  "POPESTI_LEORDENI",
  "VOLUNTARI",
  "BRAGADIRU",
];

const CustomSelect = ({
  value,
  onChange,
  placeholder,
  options,
  bgCard,
  accent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box position="relative" w="100%" ref={ref}>
      <Flex
        onClick={() => setIsOpen(!isOpen)}
        bg="whiteAlpha.50"
        border="1px solid"
        borderColor="whiteAlpha.100"
        color={value ? "white" : "whiteAlpha.300"}
        h="50px"
        borderRadius="xl"
        px={4}
        align="center"
        justify="space-between"
        cursor="pointer"
        _hover={{ borderColor: accent }}
        transition="all 0.2s"
      >
        <Text fontSize="sm" fontWeight="600">
          {value ? value.replace(/_/g, " ") : placeholder}
        </Text>
        <Text fontSize="xs">▼</Text>
      </Flex>
      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          w="100%"
          mt={2}
          bg={bgCard}
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="xl"
          boxShadow="0 10px 30px rgba(0,0,0,0.8)"
          zIndex={100}
          maxH="200px"
          overflowY="auto"
        >
          {options.map((opt) => (
            <Box
              key={opt}
              px={4}
              py={3}
              color="white"
              cursor="pointer"
              _hover={{ bg: accent, color: "black" }}
              transition="all 0.2s"
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              <Text fontSize="sm" fontWeight="bold">
                {opt.replace(/_/g, " ")}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const RegisterPage = () => {
  const [accountType, setAccountType] = useState("client");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    nume: "",
    prenume: "",
    email: "",
    telefon: "",
    password: "",
    oras: "",
    adresa: "",
    programStart: "",
    programFinal: "",
    descriere: "",
  });

  const bgMain = colors?.bgMain || "#0B0C10";
  const bgCard = colors?.bgCard || "#16181C";
  const accent = colors?.accent || "#5ED1BE";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, val) => {
    setFormData({ ...formData, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      let endpoint = "";
      let payload = {};

      if (accountType === "client") {
        endpoint = `${AUTH_API_URL}/register/user`;
        // FIX: Încapsulăm datele în `dateProfil` așa cum cere RegisterUserRequest.java
        payload = {
          password: formData.password,
          dateProfil: {
            nume: formData.nume,
            prenume: formData.prenume,
            email: formData.email,
            telefon: formData.telefon,
          },
        };
      } else {
        endpoint = `${AUTH_API_URL}/register/baza`;
        payload = {
          password: formData.password,
          dateBusiness: {
            numeBaza: formData.nume,
            oras: formData.oras,
            adresa: formData.adresa,
            descriere: formData.descriere,
            telefon: formData.telefon,
            email: formData.email,
            programStart: formData.programStart
              ? `${formData.programStart}:00`
              : null,
            programFinal: formData.programFinal
              ? `${formData.programFinal}:00`
              : null,
          },
        };
      }

      console.log(`Trimitem payload-ul către ${endpoint}:`, payload);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 403)
          throw new Error("403 Forbidden: Endpoint-ul este inaccesibil.");
        const errorText = await response.text();
        throw new Error(errorText || "Eroare la crearea contului.");
      }

      setSuccess("Contul a fost creat cu succes! Redirecționare...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "A apărut o problemă. Încearcă din nou.");
    } finally {
      setIsLoading(false);
    }
  };

  const labelStyles = {
    fontSize: "xs",
    fontWeight: "bold",
    color: "gray.400",
    mb: 1,
    textTransform: "uppercase",
  };
  const inputStyles = {
    bg: "whiteAlpha.50",
    border: "1px solid",
    borderColor: "whiteAlpha.100",
    color: "white",
    h: "50px",
    borderRadius: "xl",
    _focus: { borderColor: accent, boxShadow: "none", bg: "whiteAlpha.100" },
    _placeholder: { color: "whiteAlpha.300" },
    fontSize: "sm",
    fontWeight: "600",
  };

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

      <Flex
        justifyContent="center"
        align="center"
        position="relative"
        zIndex={2}
        py={10}
        w="full"
      >
        <Box
          p={8}
          bg={bgCard}
          borderRadius="3xl"
          w={{ base: "95%", md: "600px" }}
          border={`1px solid ${accent}22`}
          boxShadow="0 20px 40px rgba(0,0,0,0.4)"
        >
          <VStack spacing={2} mb={6} textAlign="center">
            <Heading
              color="white"
              size="lg"
              fontWeight="900"
              letterSpacing="-0.5px"
            >
              Creează Cont
            </Heading>
            <Text color="gray.400" fontSize="sm">
              Alege tipul contului și completează datele.
            </Text>
          </VStack>

          {error && (
            <Box
              bg="rgba(255, 95, 95, 0.1)"
              w="100%"
              p={3}
              borderRadius="lg"
              border="1px solid rgba(255, 95, 95, 0.3)"
              mb={4}
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

          {success && (
            <Box
              bg="rgba(94, 209, 190, 0.1)"
              w="100%"
              p={3}
              borderRadius="lg"
              border={`1px solid ${accent}`}
              mb={4}
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

          <Flex bg="blackAlpha.400" p={1} borderRadius="xl" mb={8}>
            <Button
              flex={1}
              variant={accountType === "client" ? "solid" : "ghost"}
              bg={accountType === "client" ? accent : "transparent"}
              color={accountType === "client" ? "black" : "gray.400"}
              onClick={() => setAccountType("client")}
              borderRadius="lg"
            >
              Client Jucător
            </Button>
            <Button
              flex={1}
              variant={accountType === "baza" ? "solid" : "ghost"}
              bg={accountType === "baza" ? accent : "transparent"}
              color={accountType === "baza" ? "black" : "gray.400"}
              onClick={() => setAccountType("baza")}
              borderRadius="lg"
            >
              Bază Sportivă
            </Button>
          </Flex>

          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
              gap={4}
              mb={6}
            >
              <Box
                gridColumn={{
                  base: "1 / -1",
                  md: accountType === "baza" ? "1 / -1" : "auto",
                }}
                w="100%"
              >
                <Text {...labelStyles}>
                  {accountType === "client"
                    ? "Nume de familie"
                    : "Nume Bază Sportivă"}
                </Text>
                <Input
                  name="nume"
                  value={formData.nume}
                  onChange={handleChange}
                  placeholder={
                    accountType === "client" ? "Popescu" : "Arena Premium"
                  }
                  {...inputStyles}
                  required
                />
              </Box>

              {accountType === "client" && (
                <Box w="100%">
                  <Text {...labelStyles}>Prenume</Text>
                  <Input
                    name="prenume"
                    value={formData.prenume}
                    onChange={handleChange}
                    placeholder="Andrei"
                    {...inputStyles}
                    required
                  />
                </Box>
              )}

              <Box w="100%">
                <Text {...labelStyles}>Email</Text>
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="contact@exemplu.ro"
                  {...inputStyles}
                  required
                />
              </Box>

              <Box w="100%">
                <Text {...labelStyles}>Telefon</Text>
                <Input
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  placeholder="07XX XXX XXX"
                  {...inputStyles}
                  required
                />
              </Box>

              {accountType === "baza" && (
                <>
                  <Box w="100%">
                    <Text {...labelStyles}>Oraș</Text>
                    <CustomSelect
                      value={formData.oras}
                      onChange={(val) => handleSelectChange("oras", val)}
                      placeholder="Selectează oraș"
                      options={ORAS_ENUM}
                      bgCard={bgCard}
                      accent={accent}
                    />
                  </Box>
                  <Box w="100%">
                    <Text {...labelStyles}>Adresa completă</Text>
                    <Input
                      name="adresa"
                      value={formData.adresa}
                      onChange={handleChange}
                      placeholder="Strada, Numarul..."
                      {...inputStyles}
                      required
                    />
                  </Box>
                  <Box w="100%">
                    <Text {...labelStyles}>Ora Deschidere</Text>
                    <CustomSelect
                      value={formData.programStart}
                      onChange={(val) =>
                        handleSelectChange("programStart", val)
                      }
                      placeholder="08:00"
                      options={HOURS}
                      bgCard={bgCard}
                      accent={accent}
                    />
                  </Box>
                  <Box w="100%">
                    <Text {...labelStyles}>Ora Închidere</Text>
                    <CustomSelect
                      value={formData.programFinal}
                      onChange={(val) =>
                        handleSelectChange("programFinal", val)
                      }
                      placeholder="22:00"
                      options={HOURS}
                      bgCard={bgCard}
                      accent={accent}
                    />
                  </Box>
                  <Box gridColumn={{ base: "1 / -1", md: "1 / -1" }} w="100%">
                    <Text {...labelStyles}>Descriere Bază</Text>
                    <Input
                      name="descriere"
                      value={formData.descriere}
                      onChange={handleChange}
                      placeholder="Detalii despre bază..."
                      {...inputStyles}
                    />
                  </Box>
                </>
              )}

              <Box gridColumn={{ base: "1 / -1", md: "1 / -1" }} w="100%">
                <Text {...labelStyles}>Parolă</Text>
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type="password"
                  placeholder="••••••••"
                  {...inputStyles}
                  required
                />
              </Box>
            </Box>

            <Button
              type="submit"
              w="100%"
              bg={accent}
              color="black"
              h="60px"
              borderRadius="xl"
              fontWeight="black"
              fontSize="lg"
              _hover={{ opacity: 0.8, transform: "translateY(-2px)" }}
              transition="all 0.2s"
              mt={2}
              isLoading={isLoading}
              loadingText="Se procesează..."
            >
              Finalizează Înregistrarea
            </Button>

            <Flex justify="center" mt={4}>
              <Box
                as={RouterLink}
                to="/"
                color="gray.400"
                fontSize="sm"
                _hover={{ color: "white" }}
              >
                Ai deja cont?{" "}
                <Text as="span" color={accent} fontWeight="bold">
                  Conectează-te!
                </Text>
              </Box>
            </Flex>
          </form>
        </Box>
      </Flex>
    </Container>
  );
};

export default RegisterPage;
