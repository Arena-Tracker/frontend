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
} from "@chakra-ui/react";
import { colors } from "./colors";

// 1. Generăm orele (00:00 - 23:00)
const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i < 10 ? `0${i}` : `${i}`;
  return `${hour}:00`;
});

// 2. Dropdown Custom Complet Izolat - Asta rezolvă problema din poza ta!
const CustomSelect = ({
  value,
  onChange,
  placeholder,
  bgMain,
  bgCard,
  accent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  // Închide meniul dacă dai click în afara lui
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box position="relative" ref={ref} w="100%">
      <Flex
        as="button"
        type="button"
        w="100%"
        h="55px"
        bg={bgMain}
        border="1px solid"
        borderColor="whiteAlpha.200"
        color={value ? "white" : "gray.500"}
        borderRadius="xl"
        px={4}
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ borderColor: "whiteAlpha.300" }}
      >
        <Text fontSize="md">{value || placeholder}</Text>
        <Box as="span" fontSize="xs" color="gray.500">
          ▼
        </Box>
      </Flex>

      {/* Aici e lista elegantă care înlocuiește pop-up-ul alb urât */}
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
          maxH="220px"
          overflowY="auto"
          zIndex={9999}
          py={2}
        >
          {HOURS.map((h) => (
            <Box
              key={h}
              px={4}
              py={3}
              cursor="pointer"
              color="white"
              fontWeight="medium"
              transition="all 0.2s"
              _hover={{ bg: accent, color: "black", pl: 6 }}
              onClick={() => {
                onChange(h);
                setIsOpen(false);
              }}
            >
              {h}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");

  // State pentru ore (obligatoriu pentru noul CustomSelect)
  const [programStart, setProgramStart] = useState("");
  const [programFinal, setProgramFinal] = useState("");

  const bgMain = colors?.bgMain || "#0B0C10";
  const bgCard = colors?.bgCard || "#16181C";
  const accent = colors?.accent || "#5ED1BE";

  const handleRegister = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const inputStyles = {
    bg: bgMain,
    border: "1px solid",
    borderColor: "whiteAlpha.200",
    color: "white",
    h: "55px",
    borderRadius: "xl",
    px: 4,
    w: "100%",
    fontSize: "md",
    _focus: { borderColor: accent, boxShadow: "none", outline: "none" },
    _hover: { borderColor: "whiteAlpha.300" },
  };

  const labelStyles = {
    color: "gray.400",
    mb: 2,
    fontSize: "xs",
    fontWeight: "bold",
    letterSpacing: "wider",
    display: "block",
    textTransform: "uppercase",
  };

  return (
    <Flex
      py={{ base: 6, md: 12 }}
      px={{ base: 4, md: 0 }}
      justifyContent="center"
      align="center"
      position="relative"
      zIndex={2}
    >
      <Box
        p={{ base: 6, md: 12 }}
        bg={bgCard}
        borderRadius="3xl"
        border={`1px solid ${accent}22`}
        w="100%"
        maxW="700px"
        boxShadow="0 20px 40px rgba(0,0,0,0.5)"
      >
        <VStack spacing={8} as="form" onSubmit={handleRegister} w="100%">
          <VStack spacing={2}>
            <Heading
              color="white"
              size="xl"
              letterSpacing="tight"
              textAlign="center"
            >
              Creează Cont
            </Heading>
            <Text color="gray.400" textAlign="center">
              {role === "user"
                ? "Înscrie-te ca jucător"
                : "Înscrie-ți baza sportivă"}
            </Text>
          </VStack>

          {/* Selector de Rol */}
          <Flex w="100%" bg="whiteAlpha.100" p={1} borderRadius="xl">
            <Button
              flex={1}
              onClick={() => setRole("user")}
              bg={role === "user" ? accent : "transparent"}
              color={role === "user" ? "black" : "gray.500"}
              borderRadius="lg"
              _hover={{ bg: role === "user" ? accent : "whiteAlpha.200" }}
              fontWeight="bold"
            >
              Jucător
            </Button>
            <Button
              flex={1}
              onClick={() => setRole("baza")}
              bg={role === "baza" ? accent : "transparent"}
              color={role === "baza" ? "black" : "gray.500"}
              borderRadius="lg"
              _hover={{ bg: role === "baza" ? accent : "whiteAlpha.200" }}
              fontWeight="bold"
            >
              Bază Sportivă
            </Button>
          </Flex>

          {/* Sistemul CSS Grid - Rezolvă strivirea pe mobile */}
          <Box
            display="grid"
            gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap="24px"
            w="100%"
          >
            {role === "user" ? (
              <>
                <Box w="100%">
                  <Text {...labelStyles}>Nume</Text>
                  <Input placeholder="Popescu" {...inputStyles} />
                </Box>
                <Box w="100%">
                  <Text {...labelStyles}>Prenume</Text>
                  <Input placeholder="Ion" {...inputStyles} />
                </Box>
                <Box w="100%">
                  <Text {...labelStyles}>Email</Text>
                  <Input
                    type="email"
                    placeholder="ion@email.com"
                    {...inputStyles}
                  />
                </Box>
                <Box w="100%">
                  <Text {...labelStyles}>Telefon</Text>
                  <Input type="tel" placeholder="07XXXXXXXX" {...inputStyles} />
                </Box>
              </>
            ) : (
              <>
                <Box w="100%">
                  <Text {...labelStyles}>Oraș</Text>
                  <Input placeholder="București" {...inputStyles} />
                </Box>
                <Box w="100%">
                  <Text {...labelStyles}>Adresă</Text>
                  <Input placeholder="Strada X, Nr. Y" {...inputStyles} />
                </Box>
                <Box w="100%">
                  <Text {...labelStyles}>Email Contact</Text>
                  <Input
                    type="email"
                    placeholder="contact@baza.ro"
                    {...inputStyles}
                  />
                </Box>
                <Box w="100%">
                  <Text {...labelStyles}>Telefon</Text>
                  <Input type="tel" placeholder="07XXXXXXXX" {...inputStyles} />
                </Box>

                {/* Aici folosim componenta nouă, nu <Box as="select"> */}
                <Box w="100%">
                  <Text {...labelStyles}>Program Start</Text>
                  <CustomSelect
                    value={programStart}
                    onChange={setProgramStart}
                    placeholder="Alege ora"
                    bgMain={bgMain}
                    bgCard={bgCard}
                    accent={accent}
                  />
                </Box>
                <Box w="100%">
                  <Text {...labelStyles}>Program Final</Text>
                  <CustomSelect
                    value={programFinal}
                    onChange={setProgramFinal}
                    placeholder="Alege ora"
                    bgMain={bgMain}
                    bgCard={bgCard}
                    accent={accent}
                  />
                </Box>

                <Box gridColumn={{ base: "1 / -1", md: "1 / -1" }} w="100%">
                  <Text {...labelStyles}>Descriere Bază</Text>
                  <Input
                    placeholder="Detalii despre bază..."
                    {...inputStyles}
                  />
                </Box>
              </>
            )}

            <Box gridColumn={{ base: "1 / -1", md: "1 / -1" }} w="100%">
              <Text {...labelStyles}>Parolă</Text>
              <Input type="password" placeholder="••••••••" {...inputStyles} />
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
          >
            Finalizează Înregistrarea
          </Button>

          <Box
            as={RouterLink}
            to="/"
            color="gray.400"
            fontSize="sm"
            _hover={{ color: "white" }}
          >
            Ai deja cont?{" "}
            <Text as="span" color={accent} fontWeight="bold">
              Autentifică-te
            </Text>
          </Box>
        </VStack>
      </Box>
    </Flex>
  );
};

export default RegisterPage;
