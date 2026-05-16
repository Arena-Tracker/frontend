import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Grid,
  Image,
  HStack,
  Icon,
  Badge,
  Input,
  Spinner,
} from "@chakra-ui/react";
import {
  FiPlus,
  FiEdit2,
  FiPower,
  FiTrash2,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
  FiLayers,
} from "react-icons/fi";
import { getCurrentUser } from "../utils/auth";
import { IoTicketOutline } from "react-icons/io5";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";
import { GiTennisRacket, GiVolleyballBall } from "react-icons/gi";
import { colors } from "./colors";

import AddTerenModal from "../components/AddTerenModal";
import EditTerenModal from "../components/EditTerenModal";

// ==========================================
// CONFIGURARE API & MAPĂRI
// ==========================================
const API_URL =
  import.meta.env.VITE_COURT_SERVICE_URL || "http://localhost:8082/api";

const SPORT_MAP = {
  1: "Fotbal",
  2: "Tenis",
  3: "Baschet",
  4: "Volei",
};

const REVERSE_SPORT_MAP = {
  Fotbal: 1,
  Tenis: 2,
  Baschet: 3,
  Volei: 4,
};

const SPORT_ICONS = {
  Fotbal: FaFutbol,
  Tenis: GiTennisRacket,
  Baschet: FaBasketballBall,
  Volei: GiVolleyballBall,
};

// FORMATOR DATE (Defensive Programming)
const formatTerenFromAPI = (t, isActive) => ({
  id: t.idTeren || t.id, // Daca backend-ul nu trimite ID, va fi undefined
  numeTeren: t.numeTeren || "Teren Fără Nume",
  pretPeOra: t.pretPeOra || 0,
  numarLocuri: t.numarLocuri || 0,
  idSport: t.idSport,
  sport: SPORT_MAP[t.idSport] || "Fotbal",
  servicii: t.servicii || [],
  isActive: isActive,
  image:
    t.imageUrl ||
    "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=600&auto=format&fit=crop",
});

// ==========================================
// COMPONENTA CARD TEREN (PREMIUM)
// ==========================================
const AdminTerenCard = ({ teren, onToggleStatus, onEdit, onDelete }) => (
  <Box
    bg={colors.bgCard || "#16181C"}
    borderRadius="2xl"
    overflow="hidden"
    position="relative"
    border="1px solid rgba(255, 255, 255, 0.05)"
    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
    _hover={{
      transform: "translateY(-4px)",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)",
      borderColor: "whiteAlpha.200",
    }}
  >
    <Badge
      position="absolute"
      top={3}
      right={3}
      px={3}
      py={1}
      borderRadius="full"
      zIndex={1}
      bg={teren.isActive ? "rgba(94, 209, 190, 0.2)" : "rgba(255, 95, 95, 0.2)"}
      color={teren.isActive ? "#5ED1BE" : "#FF5F5F"}
      border="1px solid"
      borderColor={
        teren.isActive ? "rgba(94, 209, 190, 0.5)" : "rgba(255, 95, 95, 0.5)"
      }
      fontWeight="900"
      fontSize="xs"
    >
      {teren.isActive ? "ACTIV" : "INACTIV"}
    </Badge>

    <Box position="relative" bg="gray.800" h="160px" w="100%">
      <Image
        src={teren.image}
        alt={teren.numeTeren}
        h="100%"
        w="100%"
        objectFit="cover"
        filter={teren.isActive ? "none" : "grayscale(100%) brightness(0.6)"}
      />
      <Box
        position="absolute"
        bottom={0}
        left={0}
        w="full"
        h="50%"
        bg="linear-gradient(to top, #16181C 0%, transparent 100%)"
      />
    </Box>

    <Box p={5}>
      <Text color="#F2F2F2" fontWeight="800" fontSize="lg" mb={1} noOfLines={1}>
        {teren.numeTeren}
      </Text>
      <Text fontSize="sm" color="gray.400" mb={4}>
        Capacitate: {teren.numarLocuri} locuri
      </Text>

      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <HStack
          color="#5ED1BE"
          fontWeight="800"
          bg="rgba(94, 209, 190, 0.1)"
          px={3}
          py={1.5}
          borderRadius="lg"
        >
          <Icon as={IoTicketOutline} />
          <Text fontSize="sm">{teren.pretPeOra} RON / h</Text>
        </HStack>
      </Flex>

      {/* AFIȘARE EXTRA SERVICII */}
      {teren.servicii && teren.servicii.length > 0 && (
        <Box
          mb={4}
          p={3}
          bg="whiteAlpha.50"
          borderRadius="xl"
          border="1px solid whiteAlpha.100"
        >
          <Flex align="center" gap={2} mb={2} color="gray.400">
            <Icon as={FiLayers} size={14} />
            <Text
              fontSize="xs"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="0.5px"
            >
              Extra Servicii
            </Text>
          </Flex>
          <Flex wrap="wrap" gap={2}>
            {teren.servicii.map((srv, idx) => (
              <Badge
                key={idx}
                bg="whiteAlpha.100"
                color="whiteAlpha.800"
                textTransform="none"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="10px"
                fontWeight="600"
              >
                {srv.nume || srv.denumire} (+{srv.pret} RON)
              </Badge>
            ))}
          </Flex>
        </Box>
      )}

      {/* ACTIUNI: Butonul de Edit a fost restaurat la designul Premium Transparent */}
      <Flex
        gap={2}
        mt={2}
        pt={4}
        borderTop="1px solid rgba(255, 255, 255, 0.05)"
      >
        <Button
          size="sm"
          flex={1}
          bg="transparent"
          color="#F2F2F2"
          border="1px solid rgba(255,255,255,0.2)"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={() => onEdit(teren)}
          borderRadius="xl"
        >
          <Icon as={FiEdit2} mr={2} /> Editează
        </Button>
        <Button
          size="sm"
          px={0}
          minW="40px"
          bg={
            teren.isActive
              ? "rgba(255, 95, 95, 0.15)"
              : "rgba(94, 209, 190, 0.15)"
          }
          color={teren.isActive ? "#FF5F5F" : "#5ED1BE"}
          _hover={{
            bg: teren.isActive
              ? "rgba(255, 95, 95, 0.3)"
              : "rgba(94, 209, 190, 0.3)",
          }}
          onClick={() => onToggleStatus(teren.id, teren.isActive)}
          borderRadius="xl"
        >
          <Icon as={FiPower} boxSize={4} />
        </Button>
        <Button
          size="sm"
          px={0}
          minW="40px"
          bg="rgba(255, 95, 95, 0.1)"
          color="#FF5F5F"
          _hover={{ bg: "#FF5F5F", color: "white" }}
          onClick={() => onDelete(teren)}
          borderRadius="xl"
        >
          <Icon as={FiTrash2} boxSize={4} />
        </Button>
      </Flex>
    </Box>
  </Box>
);

// ==========================================
// PAGINA PRINCIPALĂ
// ==========================================
const TerenuriManager = () => {
  const [terenuri, setTerenuri] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("Toate");
  const [toast, setToast] = useState(null);
  const currentUser = getCurrentUser();
  const DYNAMIC_ID = currentUser ? currentUser.id : 1;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [terenToEdit, setTerenToEdit] = useState(null);

  const showToast = (message, status = "success") => {
    setToast({ message, status });
    setTimeout(() => setToast(null), 4000);
  };

  // --- 1. FETCH TERENURI ---
  const fetchTerenuri = async () => {
    setIsLoading(true);
    try {
      const [resActive, resInactive] = await Promise.all([
        fetch(`${API_URL}/terenuri/baza-sportiva/${DYNAMIC_ID}?isActive=true`),
        fetch(`${API_URL}/terenuri/baza-sportiva/${DYNAMIC_ID}?isActive=false`),
      ]);

      if (!resActive.ok || !resInactive.ok)
        throw new Error("Eroare la preluarea datelor");

      const dataActive = await resActive.json();
      const dataInactive = await resInactive.json();

      const combined = [
        ...dataActive.map((t) => formatTerenFromAPI(t, true)),
        ...dataInactive.map((t) => formatTerenFromAPI(t, false)),
      ];

      setTerenuri(combined);
    } catch (error) {
      console.error(error);
      showToast("Eroare la conectarea cu serverul (GET).", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTerenuri();
  }, []);

  // --- 2. DEZACTIVARE / REACTIVARE (PUT) ---
  const handleToggleStatus = async (id, currentStatus) => {
    if (!id)
      return showToast(
        "Eroare: ID teren lipsă (Verifică TerenDTO.java)",
        "error",
      );

    const actiune = currentStatus ? "dezactivezi" : "reactivezi";
    if (!window.confirm(`Ești sigur că vrei să ${actiune} acest teren?`))
      return;

    try {
      const endpoint = currentStatus ? "deactivate" : "reactivate";
      const response = await fetch(`${API_URL}/terenuri/${id}/${endpoint}`, {
        method: "PUT",
      });

      if (!response.ok) throw new Error("Status Update Failed");

      setTerenuri(
        terenuri.map((t) =>
          t.id === id ? { ...t, isActive: !currentStatus } : t,
        ),
      );
      showToast(
        `Teren ${currentStatus ? "dezactivat" : "reactivat"} cu succes!`,
        "success",
      );
    } catch (error) {
      console.error(error);
      showToast("Eroare la modificarea statusului.", "error");
    }
  };

  // --- 3. ȘTERGERE (DELETE) CU VALIDARE ---
  const handleDelete = async (teren) => {
    if (!teren.id)
      return showToast(
        "Eroare: ID teren lipsă (Verifică TerenDTO.java)",
        "error",
      );

    // Regula strictă: Trebuie dezactivat înainte de ștergere
    if (teren.isActive) {
      return showToast(
        "Eroare: Terenul trebuie dezactivat înainte de a fi șters!",
        "error",
      );
    }

    if (
      !window.confirm(
        "Ești sigur că vrei să ștergi acest teren? Acțiunea este permanentă.",
      )
    )
      return;

    try {
      const response = await fetch(`${API_URL}/terenuri/${teren.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete Failed");

      setTerenuri(terenuri.filter((t) => t.id !== teren.id));
      showToast("Teren șters definitiv!", "success");
    } catch (error) {
      console.error(error);
      showToast("Eroare la ștergerea terenului.", "error");
    }
  };

  // --- 4. ADĂUGARE TEREN NOU (POST) ---
  const handleSaveCreate = async (formData) => {
    try {
      const requestBody = {
        numeTeren: formData.numeTeren,
        numarLocuri: Number(formData.numarLocuri),
        pretPeOra: Number(formData.pretPeOra),
        idBazaSportiva: DYNAMIC_ID,
        idSport: REVERSE_SPORT_MAP[formData.sport] || 1,
        servicii: formData.servicii || [],
      };

      const response = await fetch(
        `${API_URL}/terenuri/baza-sportiva/${DYNAMIC_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) throw new Error("Create Failed");

      const nouTeren = await response.json();
      setTerenuri([...terenuri, formatTerenFromAPI(nouTeren, true)]);

      showToast("Teren creat și salvat pe server!", "success");
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
      showToast("Eroare la crearea terenului.", "error");
    }
  };

  // --- 5. EDITARE TEREN EXISTENT (PUT) ---
  const handleSaveEdit = async (formData) => {
    // Fallback: Dacă formData nu are id, luăm id-ul de la terenToEdit
    const targetId = formData.id || (terenToEdit && terenToEdit.id);

    if (!targetId) {
      return showToast(
        "Eroare: ID teren lipsă (Verifică dacă modalul returnează ID-ul)!",
        "error",
      );
    }

    try {
      const requestBody = {
        numeTeren: formData.numeTeren,
        numarLocuri: Number(formData.numarLocuri),
        pretPeOra: Number(formData.pretPeOra),
        idBazaSportiva: DYNAMIC_ID,
        idSport: REVERSE_SPORT_MAP[formData.sport] || 1,
        servicii: formData.servicii || [],
      };

      const response = await fetch(`${API_URL}/terenuri/${targetId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Update Failed");

      const terenActualizat = await response.json();
      setTerenuri(
        terenuri.map((t) =>
          t.id === targetId
            ? formatTerenFromAPI(terenActualizat, t.isActive)
            : t,
        ),
      );

      showToast("Teren actualizat cu succes!", "success");
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
      showToast("Eroare la actualizarea terenului.", "error");
    }
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const openEditModal = (teren) => {
    setTerenToEdit(teren);
    setIsEditModalOpen(true);
  };

  // --- LOGICĂ DE FILTRARE CLIENT-SIDE SECURIZATĂ ---
  const availableSports = ["Toate", ...new Set(terenuri.map((t) => t.sport))];

  const groupedAndFilteredTerenuri = useMemo(() => {
    const filtered = terenuri.filter((t) => {
      // Securizăm toLowerCase() în caz că numeTeren este undefined/null
      const safeNumeTeren = t.numeTeren || "";
      const matchesSearch = safeNumeTeren
        .toLowerCase()
        .includes((searchQuery || "").toLowerCase());
      const matchesSport =
        selectedSport === "Toate" || t.sport === selectedSport;
      return matchesSearch && matchesSport;
    });

    return filtered.reduce((acc, teren) => {
      if (!acc[teren.sport]) acc[teren.sport] = [];
      acc[teren.sport].push(teren);
      return acc;
    }, {});
  }, [terenuri, searchQuery, selectedSport]);

  return (
    <Box
      position="relative"
      minH="100vh"
      bg="#0B0C0E"
      overflow="hidden"
      mt={{ base: -6, md: -10 }}
      mb={{ base: "-80px", md: -10 }}
      mx={{ base: -4, md: -10, lg: -16 }}
      py={{ base: 10, md: 16 }}
      px={{ base: 4, md: 8 }}
    >
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

      {toast && (
        <Flex
          position="fixed"
          top="4"
          right="4"
          bg={toast.status === "success" ? "#5ED1BE" : "#FF5F5F"}
          color={toast.status === "success" ? "black" : "white"}
          px={6}
          py={4}
          borderRadius="xl"
          boxShadow="xl"
          zIndex={9999}
          alignItems="center"
          gap={3}
          animation="fade-in 0.3s ease-out"
        >
          <Icon
            as={toast.status === "success" ? FiCheckCircle : FiAlertCircle}
            boxSize={5}
          />
          <Text fontWeight="900">{toast.message}</Text>
        </Flex>
      )}

      <Box position="relative" zIndex={1} maxW="1400px" mx="auto">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          mb={8}
          flexWrap="wrap"
          gap={4}
        >
          <Box>
            <Text
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="900"
              color="#F2F2F2"
              letterSpacing="-1px"
            >
              Terenurile mele
            </Text>
            <Text color="gray.400" fontSize="md" fontWeight="500">
              Sincronizate în timp real cu serverul.
            </Text>
          </Box>
          <Button
            leftIcon={<FiPlus />}
            bg="#5ED1BE"
            color="black"
            fontWeight="800"
            borderRadius="xl"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0 10px 20px -10px #5ED1BE",
            }}
            transition="all 0.3s"
            onClick={openAddModal}
          >
            Creează Teren Nou
          </Button>
        </Flex>

        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={4}
          mb={12}
          bg="rgba(22, 24, 28, 0.7)"
          backdropFilter="blur(10px)"
          border="1px solid rgba(255, 255, 255, 0.06)"
          p={4}
          borderRadius="2xl"
          alignItems="center"
          boxShadow="0 25px 50px -12px rgba(0,0,0,0.5)"
        >
          <Flex
            align="center"
            bg="whiteAlpha.50"
            borderRadius="xl"
            px={4}
            h="48px"
            w={{ base: "100%", lg: "400px" }}
            border="1px solid transparent"
            transition="all 0.3s"
            _focusWithin={{ borderColor: "#5ED1BE", bg: "whiteAlpha.100" }}
          >
            <Icon as={FiSearch} color="gray.400" boxSize={5} mr={3} />
            <Input
              placeholder="Caută după nume..."
              border="none"
              bg="transparent"
              color="#F2F2F2"
              fontWeight="500"
              px={0}
              _focus={{ outline: "none", boxShadow: "none" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Flex>

          <HStack
            overflowX="auto"
            w="100%"
            spacing={3}
            pb={{ base: 2, lg: 0 }}
            css={{ "&::-webkit-scrollbar": { display: "none" } }}
          >
            {availableSports.map((sport) => (
              <Button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                bg={selectedSport === sport ? "#5ED1BE" : "transparent"}
                color={selectedSport === sport ? "black" : "gray.400"}
                border={
                  selectedSport === sport
                    ? "none"
                    : `1px solid rgba(255,255,255,0.1)`
                }
                borderRadius="xl"
                px={6}
                h="44px"
                fontWeight="800"
                _hover={{
                  bg: selectedSport === sport ? "#4BC0AD" : "whiteAlpha.100",
                }}
                flexShrink={0}
              >
                {sport}
              </Button>
            ))}
          </HStack>
        </Flex>

        {isLoading ? (
          <Flex justify="center" align="center" py={20}>
            <Spinner color="#5ED1BE" size="xl" thickness="4px" />
          </Flex>
        ) : Object.keys(groupedAndFilteredTerenuri).length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={20}
            bg="#16181C"
            borderRadius="2xl"
            border={`1px dashed rgba(255,255,255,0.1)`}
          >
            <Icon as={FiSearch} boxSize={10} color="gray.500" mb={4} />
            <Text color="#F2F2F2" fontSize="lg" fontWeight="800">
              Niciun teren găsit.
            </Text>
          </Flex>
        ) : (
          Object.entries(groupedAndFilteredTerenuri).map(
            ([sport, terenuriList]) => (
              <Box key={sport} mb={12}>
                <Flex align="center" mb={6}>
                  <Flex
                    bg="rgba(94, 209, 190, 0.1)"
                    p={3}
                    borderRadius="xl"
                    mr={4}
                    border="1px solid rgba(94, 209, 190, 0.2)"
                  >
                    <Icon
                      as={SPORT_ICONS[sport] || IoTicketOutline}
                      boxSize={6}
                      color="#5ED1BE"
                    />
                  </Flex>
                  <Box>
                    <Text
                      fontSize="2xl"
                      fontWeight="900"
                      color="#F2F2F2"
                      letterSpacing="tight"
                    >
                      {sport}
                    </Text>
                    <Text fontSize="sm" color="gray.400" fontWeight="600">
                      {terenuriList.length}{" "}
                      {terenuriList.length === 1 ? "teren" : "terenuri"}
                    </Text>
                  </Box>
                  <Box flex={1} ml={6} h="1px" bg="whiteAlpha.100" />
                </Flex>

                <Grid
                  templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    xl: "repeat(3, 1fr)",
                  }}
                  gap={6}
                >
                  {terenuriList.map((teren, idx) => (
                    <AdminTerenCard
                      key={teren.id || `fallback-${idx}`}
                      teren={teren}
                      onToggleStatus={handleToggleStatus}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                    />
                  ))}
                </Grid>
              </Box>
            ),
          )
        )}
      </Box>

      <AddTerenModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveCreate}
      />
      <EditTerenModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        terenData={terenToEdit}
      />
    </Box>
  );
};

export default TerenuriManager;
