import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Button,
  Grid,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import {
  FiSave,
  FiLogOut,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiInfo,
  FiShield,
  FiHome,
  FiCheckCircle,
  FiXCircle,
  FiEdit2,
  FiCheck,
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// ==========================================
// CONFIGURĂRI API & DESIGN SYSTEM
// ==========================================
const API_URL =
  import.meta.env.VITE_COURT_SERVICE_URL || "http://localhost:8082/api";
const ID_BAZA_CURENTA = 1;

const DS = {
  canvas: "#0B0C0E",
  card: "#16181C",
  input: "whiteAlpha.50",
  brand: "#5ED1BE",
  text: "#F2F2F2",
  muted: "#8E8E93",
  danger: "#FF5F5F",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

// LISTA ACTUALIZATĂ PERFECT PENTRU BACKEND-UL TĂU
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

const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h <= 23; h++) {
    const hour = h < 10 ? `0${h}` : `${h}`;
    times.push(`${hour}:00`);
    times.push(`${hour}:30`);
  }
  return times;
};
const TIME_OPTIONS = generateTimeOptions();

// ==========================================
// COMPONENTE CUSTOM DE EDITARE
// ==========================================

const CustomDropdown = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box position="relative" w="full" ref={menuRef}>
      <Flex
        bg="transparent"
        h="full"
        w="full"
        alignItems="center"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* UI Afișează valoarea fără _ (ex: BUCURESTI SECTOR1) */}
        <Text flex="1" color={DS.text} fontSize="sm" fontWeight="600">
          {value ? value.replace(/_/g, " ") : ""}
        </Text>
        <Icon
          as={FiChevronDown}
          color={DS.muted}
          transform={isOpen ? "rotate(180deg)" : "none"}
          transition={DS.transition}
        />
      </Flex>
      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          left={-4}
          w="calc(100% + 32px)"
          bg={DS.card}
          border={DS.border}
          borderRadius="xl"
          boxShadow="0 10px 30px rgba(0,0,0,0.8)"
          zIndex={20}
          overflow="hidden"
        >
          <VStack
            align="stretch"
            spacing={0}
            maxH="200px"
            overflowY="auto"
            sx={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                bg: "whiteAlpha.300",
                borderRadius: "full",
              },
            }}
          >
            {options.map((opt) => (
              <Box
                key={opt}
                px={4}
                py={3}
                cursor="pointer"
                bg={value === opt ? "whiteAlpha.100" : "transparent"}
                _hover={{ bg: "whiteAlpha.200", color: DS.brand }}
                // Aici trimitem la onChange varianta brută din Backend (ex: BUCURESTI_SECTOR1)
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                borderBottom="1px solid"
                borderColor="whiteAlpha.50"
              >
                {/* Opțiunile din listă se afișează tot frumos */}
                <Text
                  color={value === opt ? DS.brand : DS.text}
                  fontSize="sm"
                  fontWeight="600"
                >
                  {opt.replace(/_/g, " ")}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

const EditableField = ({
  label,
  icon,
  name,
  value,
  onSave,
  type = "text",
  options = [],
  placeholder,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(value || "");
  }, [value]);

  const handleConfirm = () => {
    const errorMsg = onSave(name, draft);
    if (errorMsg) {
      setError(errorMsg);
    } else {
      setError("");
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setDraft(value || "");
    setError("");
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    let val = e.target.value;
    if (type === "tel") {
      val = val.replace(/[^\d+]/g, "");
    }
    setDraft(val);
  };

  return (
    <Box>
      <Flex justify="space-between" align="flex-end" mb={2}>
        <Text
          as="label"
          display="block"
          fontSize="xs"
          fontWeight="800"
          color={DS.muted}
          letterSpacing="1px"
          textTransform="uppercase"
        >
          {label}
        </Text>
        {error && (
          <Text fontSize="xs" color={DS.danger} fontWeight="bold">
            {error}
          </Text>
        )}
      </Flex>
      <Flex
        bg={isEditing ? "whiteAlpha.100" : DS.input}
        border={DS.border}
        borderColor={
          error ? DS.danger : isEditing ? DS.brand : "whiteAlpha.100"
        }
        borderRadius="xl"
        px={4}
        py={3}
        alignItems={type === "textarea" ? "flex-start" : "center"}
        transition={DS.transition}
        _hover={{
          borderColor: !isEditing && !error ? "whiteAlpha.300" : undefined,
        }}
      >
        <Icon
          as={icon}
          color={isEditing ? DS.brand : DS.muted}
          mr={3}
          mt={type === "textarea" ? 1 : 0}
        />
        <Box flex="1" mr={4}>
          {!isEditing ? (
            <Text
              color={DS.text}
              fontSize="sm"
              fontWeight="600"
              opacity={value ? 1 : 0.5}
            >
              {value
                ? type === "select"
                  ? value.replace(/_/g, " ")
                  : value
                : placeholder}
            </Text>
          ) : type === "select" ? (
            <CustomDropdown
              value={draft}
              options={options}
              onChange={setDraft}
            />
          ) : type === "textarea" ? (
            <Box
              as="textarea"
              value={draft}
              onChange={handleInputChange}
              placeholder={placeholder}
              w="full"
              minH="100px"
              bg="transparent"
              color={DS.text}
              fontWeight="500"
              fontSize="sm"
              outline="none"
              resize="vertical"
            />
          ) : (
            <Box
              as="input"
              type={type === "tel" ? "text" : type}
              value={draft}
              onChange={handleInputChange}
              placeholder={placeholder}
              w="full"
              bg="transparent"
              color={DS.text}
              fontWeight="600"
              fontSize="sm"
              outline="none"
            />
          )}
        </Box>
        {!isEditing ? (
          <Flex
            boxSize="32px"
            align="center"
            justify="center"
            borderRadius="md"
            cursor="pointer"
            color={DS.muted}
            _hover={{ color: DS.brand, bg: "whiteAlpha.100" }}
            onClick={() => setIsEditing(true)}
          >
            <Icon as={FiEdit2} boxSize={4} />
          </Flex>
        ) : (
          <HStack spacing={1}>
            <Flex
              boxSize="32px"
              align="center"
              justify="center"
              borderRadius="md"
              cursor="pointer"
              bg="rgba(94, 209, 190, 0.15)"
              color={DS.brand}
              _hover={{ bg: DS.brand, color: "black" }}
              transition={DS.transition}
              onClick={handleConfirm}
            >
              <Icon as={FiCheck} boxSize={5} />
            </Flex>
            <Flex
              boxSize="32px"
              align="center"
              justify="center"
              borderRadius="md"
              cursor="pointer"
              bg="rgba(255, 95, 95, 0.15)"
              color={DS.danger}
              _hover={{ bg: DS.danger, color: "white" }}
              transition={DS.transition}
              onClick={handleCancel}
            >
              <Icon as={FiX} boxSize={5} />
            </Flex>
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

// ==========================================
// PAGINA PRINCIPALĂ
// ==========================================
const ProfilBaza = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    idBazaSportiva: ID_BAZA_CURENTA,
    oras: "",
    adresa: "",
    descriere: "",
    telefon: "",
    email: "",
    programStart: "",
    programFinal: "",
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // --- 1. GET DATE DE LA BACKEND ---
  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await fetch(
          `${API_URL}/baze-sportive/${ID_BAZA_CURENTA}`,
        );
        if (!response.ok)
          throw new Error("Nu s-au putut prelua datele bazei sportive.");
        const data = await response.json();

        setFormData({
          idBazaSportiva: data.idBazaSportiva || ID_BAZA_CURENTA,
          oras: data.oras || "BUCURESTI_SECTOR1", // Fallback default
          adresa: data.adresa || "",
          descriere: data.descriere || "",
          telefon: data.telefon || "",
          email: data.email || "",
          programStart: data.programStart
            ? data.programStart.substring(0, 5)
            : "08:00",
          programFinal: data.programFinal
            ? data.programFinal.substring(0, 5)
            : "22:00",
        });
      } catch (error) {
        console.error(error);
        showNotification("Eroare la încărcarea profilului.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfil();
  }, []);

  // --- 2. VALIDĂRI STRICTE FRONTEND ---
  const handleFieldSave = (name, draftValue) => {
    const value = draftValue.trim();

    if (!value && name !== "descriere") {
      return "Acest câmp este obligatoriu!";
    }

    if (name === "telefon") {
      const phoneRegex = /^\+?[0-9]{10,13}$/;
      if (!phoneRegex.test(value))
        return "Format invalid (ex: +407... sau 07...).";
    }

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) return "Adresa de email nu este validă.";
    }

    let tempStart = name === "programStart" ? value : formData.programStart;
    let tempEnd = name === "programFinal" ? value : formData.programFinal;
    if (
      (name === "programStart" || name === "programFinal") &&
      tempStart === tempEnd
    ) {
      return "Programul nu poate fi de 0 ore!";
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    return null;
  };

  // --- 3. PUT ACTUALIZARE LA BACKEND ---
  const handleGlobalSave = async () => {
    setIsSaving(true);
    try {
      if (
        !formData.telefon ||
        !formData.email ||
        !formData.adresa ||
        !formData.oras
      ) {
        throw new Error("Te rugăm să completezi toate câmpurile obligatorii.");
      }

      const requestBody = {
        oras: formData.oras, // Trimite fix "BUCURESTI_SECTOR1"
        adresa: formData.adresa,
        descriere: formData.descriere,
        telefon: formData.telefon,
        email: formData.email,
        programStart:
          formData.programStart.length === 5
            ? `${formData.programStart}:00`
            : formData.programStart,
        programFinal:
          formData.programFinal.length === 5
            ? `${formData.programFinal}:00`
            : formData.programFinal,
      };

      const response = await fetch(
        `${API_URL}/baze-sportive/${ID_BAZA_CURENTA}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) throw new Error("Eroare la actualizarea profilului.");

      showNotification("Datele bazei au fost actualizate cu succes pe server!");
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Eroare la salvarea datelor.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    showNotification("Te-ai deconectat cu succes.", "info");
    setTimeout(() => navigate("/login"), 1000);
  };

  if (isLoading) {
    return (
      <Flex minH="100vh" bg={DS.canvas} justify="center" align="center">
        <Spinner color={DS.brand} size="xl" thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box
      position="relative"
      minH="100vh"
      bg={DS.canvas}
      overflow="hidden"
      mt={{ base: -6, md: -10 }}
      mb={{ base: "-80px", md: -10 }}
      mx={{ base: -4, md: -10, lg: -16 }}
      py={{ base: 10, md: 16 }}
      px={{ base: 4, md: 8 }}
    >
      {notification && (
        <Flex
          position="fixed"
          top="4"
          right="4"
          zIndex={9999}
          bg={notification.type === "error" ? DS.danger : DS.brand}
          color={notification.type === "error" ? "white" : "black"}
          px={6}
          py={4}
          borderRadius="xl"
          boxShadow="xl"
          alignItems="center"
          gap={3}
          animation="fade-in 0.3s ease-out"
        >
          <Icon
            as={notification.type === "error" ? FiXCircle : FiCheckCircle}
            boxSize={5}
          />
          <Text fontWeight="800">{notification.message}</Text>
        </Flex>
      )}

      <Box
        position="absolute"
        top="-10%"
        left="-10%"
        w="50vw"
        h="50vw"
        bg="radial-gradient(circle, rgba(94, 209, 190, 0.08) 0%, transparent 60%)"
        filter="blur(60px)"
        zIndex="0"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="10%"
        right="-10%"
        w="60vw"
        h="60vw"
        bg="radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 60%)"
        filter="blur(60px)"
        zIndex="0"
        pointerEvents="none"
      />

      <Box position="relative" zIndex={1} maxW="900px" mx="auto">
        <Flex
          justify="space-between"
          align="flex-end"
          mb={10}
          wrap="wrap"
          gap={4}
        >
          <VStack align="start" spacing={2}>
            <HStack color={DS.brand}>
              <Icon as={FiShield} boxSize={6} />
              <Text
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="900"
                color={DS.text}
                letterSpacing="-1px"
              >
                Profil Bază
              </Text>
            </HStack>
            <Text fontSize="md" color={DS.muted} fontWeight="500">
              Apasă pe iconița de editare pentru a modifica datele bazei
              sportive.
            </Text>
          </VStack>
          <Button
            variant="ghost"
            color={DS.muted}
            leftIcon={<FiLogOut />}
            _hover={{ bg: "rgba(255, 95, 95, 0.1)", color: DS.danger }}
            transition={DS.transition}
            onClick={handleLogout}
          >
            Deconectare
          </Button>
        </Flex>

        <Box
          bg={DS.card}
          border={DS.border}
          borderRadius="3xl"
          p={{ base: 6, md: 10 }}
          boxShadow="0 25px 50px -12px rgba(0,0,0,0.5)"
        >
          <Flex align="center" gap={6} mb={10}>
            <Flex
              boxSize={{ base: "80px", md: "100px" }}
              bg="whiteAlpha.100"
              color={DS.brand}
              border={`2px solid ${DS.brand}`}
              borderRadius="full"
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Icon as={FiHome} boxSize={{ base: "32px", md: "40px" }} />
            </Flex>
            <Box>
              <Text fontSize="xl" fontWeight="900" color={DS.text}>
                Identitate Bază Sportivă
              </Text>
              <Text fontSize="sm" color={DS.muted}>
                ID Bază: #{formData.idBazaSportiva}
              </Text>
            </Box>
          </Flex>
          <Box w="full" h="1px" bg="whiteAlpha.100" mb={8} />

          <VStack spacing={8} align="stretch">
            <Box>
              <Text fontSize="lg" fontWeight="800" color={DS.text} mb={4}>
                1. Locație
              </Text>
              <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={6}>
                <EditableField
                  label="Oraș"
                  icon={FiMapPin}
                  name="oras"
                  value={formData.oras}
                  onSave={handleFieldSave}
                  type="select"
                  options={ORAS_ENUM}
                />
                <EditableField
                  label="Adresă Completă"
                  icon={FiMapPin}
                  name="adresa"
                  value={formData.adresa}
                  onSave={handleFieldSave}
                  placeholder="ex: Str. Exemplu Nr. 1"
                />
              </Grid>
            </Box>

            <Box>
              <Text fontSize="lg" fontWeight="800" color={DS.text} mb={4}>
                2. Contact & Program
              </Text>
              <Grid
                templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                gap={6}
                mb={6}
              >
                <EditableField
                  label="Email Contact"
                  icon={FiMail}
                  name="email"
                  value={formData.email}
                  onSave={handleFieldSave}
                  placeholder="contact@baza.ro"
                />
                <EditableField
                  label="Telefon"
                  icon={FiPhone}
                  name="telefon"
                  value={formData.telefon}
                  onSave={handleFieldSave}
                  type="tel"
                  placeholder="+407..."
                />
              </Grid>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                <EditableField
                  label="Ora Deschidere"
                  icon={FiClock}
                  name="programStart"
                  value={formData.programStart}
                  onSave={handleFieldSave}
                  type="select"
                  options={TIME_OPTIONS}
                />
                <EditableField
                  label="Ora Închidere"
                  icon={FiClock}
                  name="programFinal"
                  value={formData.programFinal}
                  onSave={handleFieldSave}
                  type="select"
                  options={TIME_OPTIONS}
                />
              </Grid>
            </Box>

            <Box>
              <Text fontSize="lg" fontWeight="800" color={DS.text} mb={4}>
                3. Detalii Afacere
              </Text>
              <EditableField
                label="Descriere Bază Sportivă"
                icon={FiInfo}
                name="descriere"
                value={formData.descriere}
                onSave={handleFieldSave}
                type="textarea"
                placeholder="Descrie facilitățile..."
              />
            </Box>
          </VStack>

          <Flex justify="flex-end" mt={10}>
            <Button
              size="lg"
              bg={DS.brand}
              color="black"
              borderRadius="xl"
              fontWeight="800"
              px={8}
              leftIcon={<FiSave />}
              isLoading={isSaving}
              loadingText="Se Salvează..."
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: `0 10px 20px -10px ${DS.brand}`,
              }}
              transition={DS.transition}
              onClick={handleGlobalSave}
            >
              Confirmă Modificările
            </Button>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilBaza;
