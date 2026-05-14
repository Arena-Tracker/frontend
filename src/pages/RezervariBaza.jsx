// src/pages/RezervariBaza.jsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Icon,
  Grid,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiPhone,
  FiMail,
  FiZap,
  FiDownloadCloud,
  FiPrinter,
  FiCheckCircle,
  FiXCircle,
  FiActivity,
  FiTrash2,
  FiSearch,
} from "react-icons/fi";
import { colors } from "./colors";

// ==========================================
// 1. HELPER PENTRU STĂRILE REZERVĂRII
// ==========================================
const getStatusConfig = (stare) => {
  switch (stare) {
    case "ACTIV":
      return {
        color: "blue",
        icon: FiActivity,
        label: "ACTIV",
        bg: "blue.500",
        description: "Urmează / În desfășurare",
      };
    case "COMPLETATA":
      return {
        color: "green",
        icon: FiCheckCircle,
        label: "COMPLETATĂ",
        bg: "green.500",
        description: "Finalizată cu succes",
      };
    case "ANULATA":
      return {
        color: "red",
        icon: FiXCircle,
        label: "ANULATĂ",
        bg: "red.500",
        description: "Rezervare anulată",
      };
    default:
      return {
        color: "gray",
        icon: FiClock,
        label: "NECUNOSCUT",
        description: "",
      };
  }
};

// ==========================================
// 2. DATE DE TEST (MOCK)
// ==========================================
const initialMockData = [
  {
    idPayment: "REC-2405-B99",
    totalPlata: 120.0,
    dataEmitere: "2024-05-19",
    stare: "ACTIV",
    rezervare: {
      idRezervare: 2,
      data: "21 Mai 2024",
      oraStart: "10:00",
      oraFinal: "11:30",
    },
    User: {
      nume: "Ionescu",
      prenume: "Andrei",
      email: "andrei@yahoo.com",
      telefon: "0744 987 654",
      nivel: 5,
      puncte: 1200,
    },
    Teren: {
      numeTeren: "Teren Tenis #2 Zgură",
      numarLocuri: 4,
      pretPeOra: 80.0,
    },
    extraServicii: [],
  },
  {
    idPayment: "REC-2405-A18",
    totalPlata: 165.0,
    dataEmitere: "2024-05-18",
    stare: "COMPLETATA",
    rezervare: {
      idRezervare: 1,
      data: "20 Mai 2024",
      oraStart: "18:00",
      oraFinal: "20:00",
    },
    User: {
      nume: "Popescu",
      prenume: "Ion",
      email: "ion.popescu@gmail.com",
      telefon: "0722 123 456",
      nivel: 3,
      puncte: 450,
    },
    Teren: { numeTeren: "Teren Sintetic #1", numarLocuri: 10, pretPeOra: 75.0 },
    extraServicii: [{ nume: "Închiriere Minge Profi", pret: 15.0 }],
  },
  {
    idPayment: "REC-2405-C42",
    totalPlata: 100.0,
    dataEmitere: "2024-05-22",
    stare: "ANULATA",
    rezervare: {
      idRezervare: 3,
      data: "25 Mai 2024",
      oraStart: "14:00",
      oraFinal: "15:00",
    },
    User: {
      nume: "Marin",
      prenume: "George",
      email: "george.m@gmail.com",
      telefon: "0788 111 222",
      nivel: 1,
      puncte: 50,
    },
    Teren: { numeTeren: "Teren Fotbal #3", numarLocuri: 12, pretPeOra: 100.0 },
    extraServicii: [],
  },
];

// ==========================================
// 3. COMPONENTE UI PREMIUM (CUSTOM DROPDOWN)
// ==========================================
// Senior UI: Am creat un dropdown complet personalizat pentru a evita elementul nativ <select>
const ProfessionalSelect = ({
  icon,
  value,
  onChange,
  options,
  defaultLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val) => {
    // Simulăm un eveniment de target.value ca să menținem compatibilitatea cu state-ul tău
    onChange({ target: { value: val } });
    setIsOpen(false);
  };

  return (
    <Box position="relative" w="full" zIndex={isOpen ? 20 : 1}>
      {/* Overlay invizibil pe tot ecranul ca să se închidă dropdown-ul când dai click în afara lui */}
      {isOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          zIndex={10}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Trigger-ul (Butonul care arată selecția curentă) */}
      <Flex
        bg="#1a202c"
        border="1px solid"
        borderColor={isOpen ? colors.accent : "whiteAlpha.200"}
        borderRadius="xl"
        px={4}
        py={2.5}
        alignItems="center"
        cursor="pointer"
        position="relative"
        zIndex={11}
        _hover={{ borderColor: isOpen ? colors.accent : "whiteAlpha.400" }}
        transition="all 0.2s"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon as={icon} color={isOpen ? colors.accent : "gray.400"} mr={3} />
        <Text
          flex="1"
          color={value === "TOATE" ? "gray.400" : "white"}
          fontSize="sm"
          fontWeight="bold"
        >
          {value === "TOATE" ? defaultLabel : value}
        </Text>
        <Icon
          as={FiChevronDown}
          color="gray.400"
          transform={isOpen ? "rotate(180deg)" : "none"}
          transition="transform 0.2s"
        />
      </Flex>

      {/* Meniul efectiv cu opțiuni */}
      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          left={0}
          w="full"
          bg="#1a202c"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="xl"
          boxShadow="0 10px 30px rgba(0,0,0,0.8)"
          zIndex={12}
          overflow="hidden"
        >
          <VStack
            align="stretch"
            spacing={0}
            maxH="250px"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": { width: "6px" },
              "&::-webkit-scrollbar-thumb": {
                background: "#4A5568",
                borderRadius: "4px",
              },
            }}
          >
            <Box
              px={4}
              py={3}
              cursor="pointer"
              bg={value === "TOATE" ? "whiteAlpha.100" : "transparent"}
              _hover={{ bg: "whiteAlpha.200" }}
              onClick={() => handleSelect("TOATE")}
            >
              <Text
                color={value === "TOATE" ? colors.accent : "white"}
                fontSize="sm"
                fontWeight="bold"
              >
                {defaultLabel}
              </Text>
            </Box>

            {options.map((opt) => (
              <Box
                key={opt}
                px={4}
                py={3}
                cursor="pointer"
                bg={value === opt ? "whiteAlpha.100" : "transparent"}
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={() => handleSelect(opt)}
                borderTop="1px solid"
                borderColor="whiteAlpha.50"
              >
                <Text
                  color={value === opt ? colors.accent : "white"}
                  fontSize="sm"
                  fontWeight="500"
                >
                  {opt}
                </Text>
              </Box>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

const ModernSearch = ({ value, onChange }) => (
  <Flex
    bg="#1a202c"
    border="1px solid"
    borderColor="whiteAlpha.200"
    borderRadius="xl"
    px={4}
    py={2.5}
    alignItems="center"
    _hover={{ borderColor: "whiteAlpha.400" }}
    transition="all 0.2s"
    flex="1"
    w="full"
  >
    <Icon as={FiSearch} color={colors.accent} mr={3} />
    <Box
      as="input"
      placeholder="Caută client, telefon sau ID factură..."
      value={value}
      onChange={onChange}
      bg="transparent"
      color="white"
      outline="none"
      w="full"
      fontSize="sm"
      fontWeight="500"
      _placeholder={{ color: "gray.500" }}
    />
  </Flex>
);

// ==========================================
// 4. HELPER CALCUL ORE
// ==========================================
const calculateHours = (start, end) => {
  const parseTime = (time) => time.split(":").map(Number);
  const [startH, startM] = parseTime(start);
  const [endH, endM] = parseTime(end);
  const diffMinutes = endH * 60 + endM - (startH * 60 + startM);
  return Math.round((diffMinutes / 60 + Number.EPSILON) * 100) / 100;
};

// ==========================================
// 5. CARD REZERVARE (DESIGN PREMIUM SPLIT-VIEW)
// ==========================================
const RezervareCard = ({ data, onCancel }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const duration = calculateHours(
    data.rezervare.oraStart,
    data.rezervare.oraFinal,
  );
  const fieldCost = duration * data.Teren.pretPeOra;
  const status = getStatusConfig(data.stare);

  const handleCancelClick = () => {
    onCancel(data.idPayment);
    setConfirmCancel(false);
  };

  return (
    <Box
      bg={colors.bgCard}
      borderRadius="2xl"
      border="1px solid"
      borderColor={isExpanded ? status.bg : "whiteAlpha.100"}
      overflow="hidden"
      opacity={data.stare === "ANULATA" && !isExpanded ? 0.6 : 1}
      transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
      _hover={{
        borderColor: status.bg,
        boxShadow: `0 10px 30px -10px var(--chakra-colors-${status.color}-900)`,
      }}
    >
      <Flex
        p={6}
        alignItems="center"
        justifyContent="space-between"
        cursor="pointer"
        onClick={() => {
          setIsExpanded(!isExpanded);
          setConfirmCancel(false);
        }}
        wrap={{ base: "wrap", md: "nowrap" }}
        gap={4}
      >
        <HStack spacing={{ base: 4, md: 8 }}>
          <HStack color="white">
            <Box p={3} bg="whiteAlpha.100" borderRadius="xl">
              <Icon as={FiCalendar} color={colors.accent} boxSize={6} />
            </Box>
            <VStack align="start" spacing={0}>
              <Text
                fontWeight="800"
                fontSize="xl"
                letterSpacing="tight"
                textDecoration={
                  data.stare === "ANULATA" ? "line-through" : "none"
                }
              >
                {data.rezervare.data}
              </Text>
              <HStack color="whiteAlpha.600" spacing={1}>
                <Icon as={FiClock} boxSize={3} />
                <Text fontSize="sm" fontWeight="600">
                  {data.rezervare.oraStart} - {data.rezervare.oraFinal}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          <HStack
            color="whiteAlpha.800"
            display={{ base: "none", md: "flex" }}
            pl={6}
            borderLeft="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Icon as={FiMapPin} color="gray.500" />
            <Text fontWeight="500">{data.Teren.numeTeren}</Text>
          </HStack>
        </HStack>

        <HStack spacing={4}>
          <Badge
            colorPalette={status.color}
            variant="subtle"
            px={3}
            py={1.5}
            borderRadius="md"
            display={{ base: "none", sm: "flex" }}
            alignItems="center"
            gap={2}
          >
            <Icon as={status.icon} />
            <Text fontWeight="bold">{status.label}</Text>
          </Badge>
          <VStack
            align="end"
            spacing={0}
            display={{ base: "none", sm: "flex" }}
            mr={2}
            ml={2}
          >
            <Text
              fontSize="xs"
              color="gray.500"
              textTransform="uppercase"
              fontWeight="bold"
            >
              Total Plată
            </Text>
            <Text
              fontSize="lg"
              fontWeight="black"
              color="white"
              textDecoration={
                data.stare === "ANULATA" ? "line-through" : "none"
              }
            >
              {data.totalPlata.toFixed(2)} RON
            </Text>
          </VStack>
          <Button
            size="md"
            variant="ghost"
            color="whiteAlpha.700"
            _hover={{ bg: "whiteAlpha.100", color: status.bg }}
            borderRadius="full"
          >
            {isExpanded ? (
              <Icon as={FiChevronUp} boxSize={6} />
            ) : (
              <Icon as={FiChevronDown} boxSize={6} />
            )}
          </Button>
        </HStack>
      </Flex>

      {isExpanded && (
        <Box
          bg="#0d1117"
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
          p={8}
        >
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={10}>
            <VStack align="stretch" spacing={6}>
              <Flex
                justify="space-between"
                align="end"
                borderBottom="1px solid"
                borderColor="whiteAlpha.200"
                pb={3}
              >
                <Box>
                  <Text
                    color={colors.accent}
                    fontSize="xs"
                    fontWeight="bold"
                    letterSpacing="widest"
                    textTransform="uppercase"
                  >
                    {data.stare === "ANULATA"
                      ? "Factură Stornată"
                      : "Factura Fiscală"}
                  </Text>
                  <Text color="white" fontSize="xl" fontWeight="black">
                    {data.idPayment}
                  </Text>
                </Box>
                <VStack align="end" spacing={0}>
                  <Text color="gray.500" fontSize="sm">
                    Emisă la: {data.dataEmitere}
                  </Text>
                  <Text
                    color={`${status.color}.400`}
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {status.description}
                  </Text>
                </VStack>
              </Flex>

              <Box opacity={data.stare === "ANULATA" ? 0.5 : 1}>
                <Flex
                  color="gray.500"
                  fontSize="xs"
                  textTransform="uppercase"
                  fontWeight="bold"
                  mb={2}
                  px={2}
                >
                  <Text flex="2">Descriere</Text>
                  <Text flex="1" textAlign="center">
                    Durată/Buc
                  </Text>
                  <Text flex="1" textAlign="right">
                    Total
                  </Text>
                </Flex>
                <VStack align="stretch" spacing={2}>
                  <Flex
                    bg="whiteAlpha.50"
                    p={3}
                    borderRadius="md"
                    alignItems="center"
                  >
                    <Box flex="2">
                      <Text
                        color="white"
                        fontWeight="bold"
                        textDecoration={
                          data.stare === "ANULATA" ? "line-through" : "none"
                        }
                      >
                        {data.Teren.numeTeren}
                      </Text>
                      <Text color="gray.400" fontSize="xs">
                        Capacitate: {data.Teren.numarLocuri} locuri
                      </Text>
                    </Box>
                    <Text flex="1" color="white" textAlign="center">
                      {duration} ore
                    </Text>
                    <Text
                      flex="1"
                      color="white"
                      fontWeight="bold"
                      textAlign="right"
                    >
                      {fieldCost.toFixed(2)} RON
                    </Text>
                  </Flex>
                  {data.extraServicii.map((extra, idx) => (
                    <Flex
                      key={idx}
                      bg="whiteAlpha.50"
                      p={3}
                      borderRadius="md"
                      alignItems="center"
                    >
                      <Box flex="2">
                        <Text
                          color="white"
                          fontWeight="bold"
                          textDecoration={
                            data.stare === "ANULATA" ? "line-through" : "none"
                          }
                        >
                          {extra.nume}
                        </Text>
                        <Text color="gray.400" fontSize="xs">
                          Serviciu Extra
                        </Text>
                      </Box>
                      <Text flex="1" color="white" textAlign="center">
                        1 buc
                      </Text>
                      <Text
                        flex="1"
                        color="white"
                        fontWeight="bold"
                        textAlign="right"
                      >
                        {extra.pret.toFixed(2)} RON
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            </VStack>

            <VStack
              align="stretch"
              spacing={4}
              bg="whiteAlpha.50"
              p={6}
              borderRadius="xl"
              border="1px solid"
              borderColor="whiteAlpha.100"
            >
              <Box>
                <Text
                  color="gray.500"
                  fontSize="xs"
                  fontWeight="bold"
                  textTransform="uppercase"
                  mb={3}
                >
                  Date Client
                </Text>
                <HStack mb={2}>
                  <Box p={2} bg="blackAlpha.400" borderRadius="md">
                    <Icon as={FiUser} color={colors.accent} />
                  </Box>
                  <Box>
                    <Text color="white" fontWeight="bold" lineHeight="1">
                      {data.User.nume} {data.User.prenume}
                    </Text>
                    <Text color="yellow.400" fontSize="xs" mt={1}>
                      Nivel {data.User.nivel} • {data.User.puncte} pct
                    </Text>
                  </Box>
                </HStack>
                <HStack color="gray.400" fontSize="sm" mt={3}>
                  <Icon as={FiPhone} />
                  <Text>{data.User.telefon}</Text>
                </HStack>
                <HStack color="gray.400" fontSize="sm" mt={1}>
                  <Icon as={FiMail} />
                  <Text>{data.User.email}</Text>
                </HStack>
              </Box>

              <Box
                borderTop="1px dashed"
                borderColor="whiteAlpha.200"
                pt={5}
                mt={2}
              >
                <VStack spacing={3}>
                  <Button
                    w="full"
                    bg={
                      data.stare === "ANULATA"
                        ? "whiteAlpha.200"
                        : colors.accent
                    }
                    color={data.stare === "ANULATA" ? "white" : "black"}
                    _hover={
                      data.stare === "ANULATA"
                        ? { bg: "whiteAlpha.300" }
                        : { bg: "teal.400", transform: "translateY(-2px)" }
                    }
                    transition="all 0.2s"
                    disabled={data.stare === "ANULATA"}
                  >
                    <Icon as={FiDownloadCloud} mr={2} />{" "}
                    {data.stare === "ANULATA"
                      ? "Indisponibil"
                      : "Descarcă PDF Factură"}
                  </Button>

                  {data.stare === "ACTIV" && (
                    <Box
                      w="full"
                      pt={3}
                      borderTop="1px solid"
                      borderColor="whiteAlpha.100"
                    >
                      {!confirmCancel ? (
                        <Button
                          w="full"
                          variant="outline"
                          borderColor="red.500"
                          color="red.400"
                          _hover={{ bg: "red.500", color: "white" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmCancel(true);
                          }}
                        >
                          <Icon as={FiTrash2} mr={2} /> Anulează Rezervarea
                        </Button>
                      ) : (
                        <VStack
                          bg="red.900"
                          p={3}
                          borderRadius="md"
                          border="1px solid"
                          borderColor="red.500"
                          alignItems="center"
                        >
                          <Text
                            color="white"
                            fontSize="sm"
                            fontWeight="bold"
                            textAlign="center"
                          >
                            Confirmi anularea definitivă?
                          </Text>
                          <HStack w="full">
                            <Button
                              size="sm"
                              flex="1"
                              bg="red.500"
                              color="white"
                              _hover={{ bg: "red.600" }}
                              onClick={handleCancelClick}
                            >
                              Da, anulează
                            </Button>
                            <Button
                              size="sm"
                              flex="1"
                              variant="ghost"
                              color="white"
                              _hover={{ bg: "whiteAlpha.200" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmCancel(false);
                              }}
                            >
                              Înapoi
                            </Button>
                          </HStack>
                        </VStack>
                      )}
                    </Box>
                  )}
                </VStack>
              </Box>
            </VStack>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

// ==========================================
// 6. PAGINA PRINCIPALĂ
// ==========================================
const RezervariBaza = () => {
  const [rezervari, setRezervari] = useState(initialMockData);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtruStare, setFiltruStare] = useState("TOATE");
  const [filtruTeren, setFiltruTeren] = useState("TOATE");

  const terenuriDisponibile = useMemo(() => {
    return [...new Set(rezervari.map((r) => r.Teren.numeTeren))];
  }, [rezervari]);

  const rezervariFiltrate = useMemo(() => {
    return rezervari.filter((r) => {
      const matchesSearch =
        searchTerm === "" ||
        r.User.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.User.prenume.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.User.telefon.includes(searchTerm) ||
        r.idPayment.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStare = filtruStare === "TOATE" || r.stare === filtruStare;
      const matchesTeren =
        filtruTeren === "TOATE" || r.Teren.numeTeren === filtruTeren;

      return matchesSearch && matchesStare && matchesTeren;
    });
  }, [rezervari, searchTerm, filtruStare, filtruTeren]);

  const anuleazaRezervare = (idPayment) => {
    setRezervari((prev) =>
      prev.map((rez) =>
        rez.idPayment === idPayment ? { ...rez, stare: "ANULATA" } : rez,
      ),
    );
  };

  return (
    <Box
      position="relative"
      minH="100vh"
      bg="#0B0C0E" // Setăm același negru profund de la user
      overflow="hidden"
      mt={{ base: -6, md: -10 }}
      mb={{ base: "-80px", md: -10 }}
      mx={{ base: -4, md: -10, lg: -16 }}
      py={{ base: 10, md: 16 }}
      px={{ base: 4, md: 8 }}
    >
      {/* FUNDAL GLOW ADUS DIN BOOKINGS CONTENT */}
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

      {/* WRAPPER-UL DE CONȚINUT (Setăm zIndex=1 ca să fie peste glow) */}
      <Box position="relative" zIndex={1} maxW="1200px" mx="auto">
        <VStack align="start" spacing={2} mb={8}>
          <HStack color={colors.accent}>
            <Icon as={FiZap} boxSize={6} />
            <Text
              fontSize="4xl"
              fontWeight="900"
              color="white"
              letterSpacing="tight"
            >
              Rezervările Bazei
            </Text>
          </HStack>
          <Text color="gray.400" fontSize="lg">
            Baza ta are zeci de terenuri? Găsește rezervarea instantaneu cu
            filtrele de mai jos.
          </Text>
        </VStack>

        <Box
          bg="#16181C" // Setăm o culoare slightly lighter, similară cu cardurile din Bookings
          p={5}
          borderRadius="2xl"
          border="1px solid"
          borderColor="whiteAlpha.100"
          mb={8}
          boxShadow="0 20px 40px -15px rgba(0, 0, 0, 0.6)"
        >
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr 1fr" }} gap={4}>
            <ModernSearch
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <ProfessionalSelect
              icon={FiActivity}
              value={filtruStare}
              onChange={(e) => setFiltruStare(e.target.value)}
              options={["ACTIV", "COMPLETATA", "ANULATA"]}
              defaultLabel="Toate Stările"
            />

            <ProfessionalSelect
              icon={FiMapPin}
              value={filtruTeren}
              onChange={(e) => setFiltruTeren(e.target.value)}
              options={terenuriDisponibile}
              defaultLabel="Toate Terenurile"
            />
          </Grid>
        </Box>

        <VStack spacing={5} align="stretch">
          <Text
            color="gray.500"
            fontSize="sm"
            fontWeight="bold"
            textTransform="uppercase"
            pl={2}
          >
            Afișare {rezervariFiltrate.length} rezultate
          </Text>

          {rezervariFiltrate.length > 0 ? (
            rezervariFiltrate.map((item) => (
              <RezervareCard
                key={item.idPayment}
                data={item}
                onCancel={anuleazaRezervare}
              />
            ))
          ) : (
            <Box
              p={10}
              textAlign="center"
              bg="whiteAlpha.50"
              borderRadius="2xl"
              border="1px dashed"
              borderColor="whiteAlpha.200"
            >
              <Icon as={FiCalendar} boxSize={10} color="gray.600" mb={4} />
              <Text color="white" fontSize="xl" fontWeight="bold">
                Niciun rezultat găsit
              </Text>
              <Text color="gray.400">
                Nu există rezervări care să corespundă criteriilor selectate.
              </Text>
              <Button
                mt={4}
                variant="outline"
                color={colors.accent}
                borderColor={colors.accent}
                onClick={() => {
                  setSearchTerm("");
                  setFiltruTeren("TOATE");
                  setFiltruStare("TOATE");
                }}
              >
                Resetează Filtrele
              </Button>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default RezervariBaza;
