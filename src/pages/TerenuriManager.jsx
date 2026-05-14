import React, { useState, useMemo } from "react";
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
} from "@chakra-ui/react";
import {
  FiPlus,
  FiEdit2,
  FiPower,
  FiTrash2,
  FiSearch,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { IoTicketOutline } from "react-icons/io5";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";
import { GiTennisRacket } from "react-icons/gi";
import { colors } from "./colors";

// IMPORTĂM MODALELE
import AddTerenModal from "../components/AddTerenModal";
import EditTerenModal from "../components/EditTerenModal";

// --- MOCK DATA ---
const INITIAL_TERENURI = [
  {
    id: 1,
    numeTeren: "Teren Sintetic Central",
    idSport: 1,
    sport: "Fotbal",
    pretPeOra: 120,
    numarLocuri: 12,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    numeTeren: "Teren Zgură 1",
    idSport: 2,
    sport: "Tenis",
    pretPeOra: 80,
    numarLocuri: 4,
    isActive: false,
    image:
      "https://images.unsplash.com/photo-1542144582-1ba00456b5ce?q=80&w=600&auto=format&fit=crop",
  },
];

const SPORT_ICONS = {
  Fotbal: FaFutbol,
  Tenis: GiTennisRacket,
  Baschet: FaBasketballBall,
  Volei: IoTicketOutline,
};

const AdminTerenCard = ({ teren, onToggleStatus, onEdit, onDelete }) => (
  <Box
    bg={colors.bgCard}
    borderRadius="2xl"
    overflow="hidden"
    position="relative"
    transition="all 0.2s"
    _hover={{
      transform: "translateY(-4px)",
      boxShadow: `0 10px 30px rgba(0,0,0,0.5)`,
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
      colorScheme={teren.isActive ? "green" : "red"}
      variant="solid"
      textTransform="capitalize"
    >
      {teren.isActive ? "Activ" : "Inactiv"}
    </Badge>
    <Box bg="gray.800" h="160px" w="100%">
      <Image
        src={teren.image}
        alt={teren.numeTeren}
        h="100%"
        w="100%"
        objectFit="cover"
        filter={teren.isActive ? "none" : "grayscale(80%) opacity(0.7)"}
        onError={(e) => {
          e.target.src =
            "https://placehold.co/600x400/16181C/5ED1BE?text=Fara+Imagine";
        }}
      />
    </Box>
    <Box p={5}>
      <Text
        color={colors.textMain}
        fontWeight="600"
        fontSize="lg"
        mb={4}
        noOfLines={1}
      >
        {teren.numeTeren}
      </Text>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <HStack
          color={colors.accent}
          fontWeight="600"
          bg="rgba(94, 209, 190, 0.1)"
          px={3}
          py={1}
          borderRadius="md"
        >
          <Icon as={IoTicketOutline} />
          <Text fontSize="sm">{teren.pretPeOra} RON / oră</Text>
        </HStack>
      </Flex>
      <Flex gap={2} mt={2}>
        <Button
          size="sm"
          flex={1}
          bg="transparent"
          color={colors.textMain}
          border={`1px solid rgba(255,255,255,0.2)`}
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={() => onEdit(teren)}
        >
          <Icon as={FiEdit2} mr={2} /> Editează
        </Button>
        <Button
          size="sm"
          px={0}
          minW="32px"
          bg={teren.isActive ? "orange.500" : "green.500"}
          color="white"
          _hover={{ filter: "brightness(1.2)" }}
          onClick={() => onToggleStatus(teren.id)}
        >
          <Icon as={FiPower} boxSize={4} />
        </Button>
        <Button
          size="sm"
          px={0}
          minW="32px"
          bg="red.500"
          color="white"
          _hover={{ filter: "brightness(1.2)" }}
          onClick={() => onDelete(teren.id)}
        >
          <Icon as={FiTrash2} boxSize={4} />
        </Button>
      </Flex>
    </Box>
  </Box>
);

const TerenuriManager = () => {
  const [terenuri, setTerenuri] = useState(INITIAL_TERENURI);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("Toate");
  const [toast, setToast] = useState(null);

  // Stări pentru Modale
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [terenToEdit, setTerenToEdit] = useState(null);

  const showToast = (message, status = "success") => {
    setToast({ message, status });
    setTimeout(() => setToast(null), 3500);
  };

  const handleToggleStatus = (id) => {
    const terenSelectat = terenuri.find((t) => t.id === id);
    if (!terenSelectat) return;
    const actiune = terenSelectat.isActive ? "dezactivezi" : "reactivezi";
    if (window.confirm(`Ești sigur că vrei să ${actiune} acest teren?`)) {
      setTerenuri(
        terenuri.map((t) =>
          t.id === id ? { ...t, isActive: !t.isActive } : t,
        ),
      );
      showToast(
        `Teren ${terenSelectat.isActive ? "dezactivat" : "reactivat"} cu succes!`,
        "success",
      );
    }
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Ești sigur că vrei să ștergi acest teren? Această acțiune este permanentă.",
      )
    ) {
      setTerenuri(terenuri.filter((t) => t.id !== id));
      showToast("Teren șters cu succes!", "success");
    }
  };

  const openAddModal = () => setIsAddModalOpen(true);

  const openEditModal = (teren) => {
    setTerenToEdit(teren);
    setIsEditModalOpen(true);
  };

  // --- HANDLER PENTRU CREARE TEREN NOU ---
  const handleSaveCreate = (formData) => {
    if (!formData.numeTeren || formData.numeTeren.length < 3)
      return showToast("Numele trebuie să aibă minim 3 caractere!", "warning");
    if (formData.pretPeOra === "" || Number(formData.pretPeOra) < 0)
      return showToast("Prețul pe oră este invalid!", "warning");
    if (!formData.numarLocuri || Number(formData.numarLocuri) < 1)
      return showToast("Numărul de locuri trebuie să fie minim 1!", "warning");

    const sportName =
      { 1: "Fotbal", 2: "Tenis", 3: "Baschet", 4: "Volei" }[formData.idSport] ||
      "Fotbal";

    const newTeren = {
      ...formData,
      sport: sportName,
      id: Date.now(),
      isActive: true,
      image: "https://placehold.co/600x400/16181C/5ED1BE?text=Teren+Nou",
    };

    setTerenuri([...terenuri, newTeren]);
    showToast("Teren creat cu succes!", "success");
    setIsAddModalOpen(false); // Închidem modalul de creare
  };

  // --- HANDLER PENTRU EDITARE TEREN EXISTENT ---
  const handleSaveEdit = (formData) => {
    if (formData.numeTeren !== undefined && formData.numeTeren.length < 3)
      return showToast("Numele trebuie să aibă minim 3 caractere!", "warning");
    if (formData.pretPeOra !== undefined && Number(formData.pretPeOra) < 0)
      return showToast("Prețul pe oră nu poate fi negativ!", "warning");

    setTerenuri(
      terenuri.map((t) => (t.id === formData.id ? { ...t, ...formData } : t)),
    );
    showToast("Teren actualizat cu succes!", "success");
    setIsEditModalOpen(false); // Închidem modalul de editare
  };

  const availableSports = ["Toate", ...new Set(terenuri.map((t) => t.sport))];

  const groupedAndFilteredTerenuri = useMemo(() => {
    const filtered = terenuri.filter((t) => {
      const matchesSearch = t.numeTeren
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
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
      {/* GLOW BACKGROUND (Fundalul Premium Gradient) */}
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

      {/* Sistemul Custom de Toast (Z-Index Mare) */}
      {toast && (
        <Flex
          position="fixed"
          top="4"
          right="4"
          bg={toast.status === "success" ? "#5ED1BE" : "#FF5F5F"}
          color="black"
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
          <Text fontWeight="800">{toast.message}</Text>
        </Flex>
      )}

      {/* WRAPPER PRINCIPAL - PUS PESTE GRADIENT (zIndex = 1) */}
      <Box position="relative" zIndex={1} maxW="1400px" mx="auto">
        {/* Header & Buton Adăugare */}
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
              color={colors.textMain || "#F2F2F2"}
              letterSpacing="-1px"
            >
              Terenurile mele
            </Text>
            <Text color="gray.400" fontSize="md" fontWeight="500">
              Gestionează terenurile și disponibilitatea lor.
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

        {/* Bara Căutare și Filtre */}
        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={4}
          mb={12}
          bg="#16181C"
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
              color={colors.textMain || "#F2F2F2"}
              fontWeight="500"
              px={0}
              _focus={{ outline: "none", boxShadow: "none" }}
              _focusVisible={{ outline: "none" }}
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
                borderRadius="full"
                px={6}
                h="40px"
                fontWeight="700"
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

        {/* Grid-ul cu Terenuri */}
        {Object.keys(groupedAndFilteredTerenuri).length === 0 ? (
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
            <Text color={colors.textMain} fontSize="lg" fontWeight="600">
              Nu am găsit niciun teren.
            </Text>
          </Flex>
        ) : (
          Object.entries(groupedAndFilteredTerenuri).map(
            ([sport, terenuriList]) => (
              <Box key={sport} mb={12}>
                <Flex align="center" mb={6}>
                  <Flex
                    bg="rgba(94, 209, 190, 0.15)"
                    p={3}
                    borderRadius="xl"
                    mr={4}
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
                      fontWeight="800"
                      color={colors.textMain}
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
                  {terenuriList.map((teren) => (
                    <AdminTerenCard
                      key={teren.id}
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

      {/* MODAL CREARE (Design Deschis) */}
      <AddTerenModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveCreate}
      />

      {/* MODAL EDITARE (Design Închis - Depth Inversion) */}
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
