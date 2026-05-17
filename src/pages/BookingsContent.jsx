import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Image,
  Badge,
  Button,
  Grid,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiClock,
  FiMapPin,
  FiRefreshCw,
  FiXCircle,
  FiCheckCircle,
  FiMoreHorizontal,
  FiAlertTriangle,
  FiDownloadCloud,
  FiCheck,
} from "react-icons/fi";
import { FaFutbol, FaBasketballBall } from "react-icons/fa";
import { GiTennisRacket } from "react-icons/gi";
import { API_URLS } from "../config/api.config";
import { getCurrentUser } from "../utils/auth";
/**
 * @constant ID_USER_CURRENT
 */

/**
 * @constant DESIGN_SYSTEM
 */
const DS = {
  colors: {
    canvas: "#0B0C0E",
    card: "#16181C",
    input: "#22252A",
    brand: "#5ED1BE",
    text: "#F2F2F2",
    muted: "#8E8E93",
    danger: "#FF5F5F",
  },
  border: "1px solid rgba(255, 255, 255, 0.06)",
  shadow: "0 20px 40px -15px rgba(0, 0, 0, 0.6)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

const TABS = [
  { id: "all", label: "Toate" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Finalizate" },
  { id: "cancelled", label: "Anulate" },
];

const getBaseUrl = (url) => {
  if (!url) return "";
  return url.endsWith("/api") ? url.slice(0, -4) : url;
};

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  return timeStr.length >= 5 ? timeStr.slice(0, 5) : timeStr;
};

const mapStatus = (backendStatus) => {
  const s = String(backendStatus || "")
    .toUpperCase()
    .trim();
  if (["CONFIRMATA", "ACTIV", "ACTIVE", "CONFIRMAT"].includes(s))
    return "active";
  if (["ANULATA", "ANULAT", "CANCELLED", "INACTIV"].includes(s))
    return "cancelled";
  if (["FINALIZATA", "COMPLETAT", "FINALIZAT", "COMPLETED"].includes(s))
    return "completed";
  return "active";
};

const deduceSportName = (teren) => {
  const nume = String(teren.numeTeren || "").toLowerCase();
  if (nume.includes("fotbal")) return "Fotbal";
  if (nume.includes("baschet") || nume.includes("basket")) return "Baschet";
  if (
    nume.includes("tenis") ||
    nume.includes("padel") ||
    nume.includes("tennis")
  )
    return "Tenis";

  const id = Number(teren.idSport || 1);
  if (id === 1) return "Fotbal";
  if (id === 2) return "Baschet";
  if (id === 3) return "Tenis";
  return "Fotbal";
};

const getSportConfig = (sportName) => {
  switch (sportName) {
    case "Fotbal":
      return {
        name: "Fotbal",
        icon: FaFutbol,
        color: "#5ED1BE",
        img: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1173&auto=format&fit=crop",
      };
    case "Baschet":
      return {
        name: "Baschet",
        icon: FaBasketballBall,
        color: "#F97316",
        img: "https://sportarena.ro/wp/wp-content/uploads/2020/11/MG_3314-scaled.jpg",
      };
    case "Tenis":
      return {
        name: "Tenis",
        icon: GiTennisRacket,
        color: "#A855F7",
        img: "https://booksport.ro/_next/image?url=https%3A%2F%2Fimg.booksport.ro%2Fclubs%2F104%2Fsmall%2Fprimaverii_main_sala.jpg&w=1080&q=75",
      };
    default:
      return {
        name: "Sport",
        icon: FaFutbol,
        color: "#5ED1BE",
        img: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1173&auto=format&fit=crop",
      };
  }
};

const PremiumBookingCard = ({ booking, onCancelClick, onAlert }) => {
  const SportIcon = booking.icon;
  const [isDownloading, setIsDownloading] = useState(false);

  const getStatusStyles = (status) => {
    switch (status) {
      case "active":
        return {
          label: "ACTIV",
          bg: "rgba(94, 209, 190, 0.15)",
          color: DS.colors.brand,
          icon: FiCheck,
        };
      case "completed":
        return {
          label: "FINALIZAT",
          bg: "whiteAlpha.100",
          color: DS.colors.text,
          icon: FiCheck,
        };
      case "cancelled":
        return {
          label: "ANULAT",
          bg: "rgba(255, 95, 95, 0.1)",
          color: DS.colors.danger,
          icon: FiXCircle,
        };
      default:
        return {
          label: "NECUNOSCUT",
          bg: "whiteAlpha.100",
          color: DS.colors.text,
          icon: FiMoreHorizontal,
        };
    }
  };

  const statusStyles = getStatusStyles(booking.status);

  const handleDownloadInvoice = async () => {
    try {
      setIsDownloading(true);
      const paymentBaseUrl =
        getBaseUrl(API_URLS.PAYMENTS) || "http://localhost:8084";
      const response = await fetch(
        `${paymentBaseUrl}/api/payment/${booking.paymentId}/pdf`,
      );

      if (!response.ok) throw new Error("Nu s-a putut genera factura!");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Factura_${booking.paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      onAlert("success", "Factura a fost descărcată!");
    } catch (error) {
      console.error(error);
      onAlert("error", "Eroare la descărcarea facturii.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Box
      role="group"
      bg="rgba(22, 24, 28, 0.6)"
      backdropFilter="blur(20px)"
      border={DS.border}
      borderRadius="3xl"
      p={{ base: 5, md: 6 }}
      position="relative"
      transition={DS.transition}
      _hover={{
        transform: "translateY(-4px)",
        borderColor: booking.color,
        boxShadow: `0 20px 40px -15px ${booking.color}40`,
        bg: "rgba(22, 24, 28, 0.85)",
      }}
    >
      <Box
        position="absolute"
        top="0"
        right="0"
        w="100px"
        h="100px"
        bg={booking.color}
        filter="blur(80px)"
        opacity={0.1}
        borderRadius="full"
        pointerEvents="none"
      />

      <Flex justify="space-between" align="center" mb={6}>
        <Flex align="center" gap={3}>
          <Flex
            align="center"
            gap={2}
            bg="whiteAlpha.50"
            px={3}
            py={1.5}
            borderRadius="full"
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            <Box color={booking.color}>
              <SportIcon size={14} />
            </Box>
            <Text
              fontSize="xs"
              fontWeight="800"
              color={DS.colors.text}
              letterSpacing="0.5px"
              textTransform="uppercase"
            >
              {booking.sport}
            </Text>
          </Flex>
          <Text
            fontSize="xs"
            fontWeight="600"
            color={DS.colors.muted}
            display={{ base: "none", sm: "block" }}
          >
            ID REZ: {booking.id}
          </Text>
        </Flex>
        <Badge
          display="flex"
          alignItems="center"
          gap={1.5}
          bg={statusStyles.bg}
          color={statusStyles.color}
          px={3}
          py={1.5}
          borderRadius="full"
          fontSize="10px"
          fontWeight="900"
          letterSpacing="0.5px"
        >
          <Icon as={statusStyles.icon} size={12} />
          {statusStyles.label}
        </Badge>
      </Flex>

      <Flex
        direction={{ base: "column", md: "row" }}
        gap={6}
        align={{ base: "flex-start", md: "center" }}
      >
        <Box
          w={{ base: "full", md: "110px" }}
          h={{ base: "140px", md: "110px" }}
          borderRadius="2xl"
          overflow="hidden"
          position="relative"
          flexShrink={0}
        >
          <Image
            src={booking.image}
            alt={booking.venueName}
            objectFit="cover"
            w="full"
            h="full"
            transition={DS.transition}
            _groupHover={{ transform: "scale(1.08)" }}
          />
        </Box>
        <Box flex={1}>
          <Text
            fontSize="xl"
            fontWeight="900"
            color={DS.colors.text}
            letterSpacing="-0.5px"
            mb={1}
          >
            {booking.venueName}
          </Text>
          <Flex align="center" gap={2} color={DS.colors.muted}>
            <FiMapPin size={14} />
            <Text fontSize="sm" fontWeight="600">
              {booking.location}
            </Text>
          </Flex>
        </Box>
        <HStack spacing={3} w={{ base: "full", md: "auto" }}>
          <Box
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.100"
            p={3}
            borderRadius="xl"
            minW="120px"
            flex={{ base: 1, md: "none" }}
          >
            <Flex align="center" gap={2} color={DS.colors.muted} mb={1}>
              <FiCalendar size={12} />
              <Text fontSize="10px" fontWeight="800" letterSpacing="0.5px">
                DATA
              </Text>
            </Flex>
            <Text fontSize="sm" fontWeight="800" color={DS.colors.text}>
              {booking.date}
            </Text>
          </Box>
          <Box
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.100"
            p={3}
            borderRadius="xl"
            minW="120px"
            flex={{ base: 1, md: "none" }}
          >
            <Flex align="center" gap={2} color={DS.colors.muted} mb={1}>
              <FiClock size={12} />
              <Text fontSize="10px" fontWeight="800" letterSpacing="0.5px">
                INTERVAL
              </Text>
            </Flex>
            <Text fontSize="sm" fontWeight="800" color={DS.colors.text}>
              {booking.time}
            </Text>
          </Box>
        </HStack>
      </Flex>

      {booking.extraServices && booking.extraServices.length > 0 && (
        <Box
          w="full"
          mt={6}
          p={3}
          bg="whiteAlpha.50"
          borderRadius="xl"
          border="1px solid"
          borderColor="whiteAlpha.100"
        >
          <Text
            fontSize="10px"
            color={DS.colors.muted}
            fontWeight="800"
            letterSpacing="1px"
            mb={2}
          >
            SERVICII EXTRA INCLUSE
          </Text>
          <Flex wrap="wrap" gap={2}>
            {booking.extraServices.map((extra, idx) => (
              <Badge
                key={idx}
                bg="whiteAlpha.200"
                border="1px solid"
                borderColor="whiteAlpha.200"
                color={DS.colors.text}
                px={2.5}
                py={1}
                borderRadius="lg"
                textTransform="none"
                fontWeight="600"
              >
                {extra.nume || "Serviciu"}{" "}
                <Text as="span" color={DS.colors.brand} ml={1}>
                  +{extra.pret} RON
                </Text>
              </Badge>
            ))}
          </Flex>
        </Box>
      )}

      <Box
        w="full"
        borderBottom="2px dashed"
        borderColor="whiteAlpha.100"
        my={6}
      />

      <Flex justify="space-between" align="center">
        <VStack align="start" spacing={0}>
          <Text
            fontSize="10px"
            color={DS.colors.muted}
            fontWeight="800"
            letterSpacing="1px"
          >
            TOTAL DE PLATĂ
          </Text>
          <Text fontSize="lg" color={DS.colors.text} fontWeight="900">
            {booking.price}
          </Text>
        </VStack>
        <HStack spacing={3}>
          {booking.paymentId && booking.paymentId !== "N/A" && (
            <Button
              h="40px"
              px={4}
              bg="whiteAlpha.50"
              color={DS.colors.text}
              borderRadius="xl"
              fontSize="xs"
              fontWeight="800"
              border="1px solid"
              borderColor="whiteAlpha.100"
              leftIcon={<FiDownloadCloud size={14} />}
              _hover={{ bg: "whiteAlpha.200", color: DS.colors.brand }}
              transition={DS.transition}
              onClick={handleDownloadInvoice}
              isLoading={isDownloading}
              loadingText="Se generează..."
            >
              Factură
            </Button>
          )}
          {booking.status === "active" ? (
            <Button
              h="40px"
              px={6}
              bg="rgba(255, 95, 95, 0.1)"
              color={DS.colors.danger}
              borderRadius="xl"
              fontSize="xs"
              fontWeight="800"
              _hover={{ bg: "rgba(255, 95, 95, 0.2)" }}
              transition={DS.transition}
              onClick={() => onCancelClick(booking.id)}
            >
              Anulează
            </Button>
          ) : (
            <Button
              h="40px"
              px={6}
              bg="whiteAlpha.100"
              color={DS.colors.text}
              borderRadius="xl"
              fontSize="xs"
              fontWeight="800"
              leftIcon={<FiRefreshCw size={14} />}
              _hover={{ bg: DS.colors.brand, color: DS.colors.canvas }}
              transition={DS.transition}
            >
              Rezervă iar
            </Button>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

const BookingsContent = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [realBookings, setRealBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();
  const DYNAMIC_ID = currentUser ? currentUser.id : 1;
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const [customToast, setCustomToast] = useState({
    isOpen: false,
    type: "success",
    message: "",
  });

  const showToast = (type, message) => {
    setCustomToast({ isOpen: true, type, message });
    setTimeout(() => {
      setCustomToast((prev) => ({ ...prev, isOpen: false }));
    }, 4000);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const paymentBaseUrl =
        getBaseUrl(API_URLS.PAYMENTS) || "http://localhost:8084";
      const bookingBaseUrl =
        getBaseUrl(API_URLS.BOOKING) || "http://localhost:8082";

      const resPayments = await fetch(
        `${paymentBaseUrl}/api/payment/user/${DYNAMIC_ID}`,
      );
      if (!resPayments.ok) throw new Error("Eroare servere");
      const payments = await resPayments.json();

      let bookings = [];
      if (activeTab === "all") {
        const [resAct, resAnu, resComp] = await Promise.all([
          fetch(`${bookingBaseUrl}/api/rezervari/user/${DYNAMIC_ID}/ACTIV`),
          fetch(`${bookingBaseUrl}/api/rezervari/user/${DYNAMIC_ID}/ANULAT`),
          fetch(`${bookingBaseUrl}/api/rezervari/user/${DYNAMIC_ID}/COMPLETAT`),
        ]);
        if (resAct.ok) bookings.push(...(await resAct.json()));
        if (resAnu.ok) bookings.push(...(await resAnu.json()));
        if (resComp.ok) bookings.push(...(await resComp.json()));
      } else {
        let backendStatusParam = "ACTIV";
        if (activeTab === "cancelled") backendStatusParam = "ANULAT";
        if (activeTab === "completed") backendStatusParam = "COMPLETAT";

        const resBookings = await fetch(
          `${bookingBaseUrl}/api/rezervari/user/${DYNAMIC_ID}/${backendStatusParam}`,
        );
        if (resBookings.ok) bookings = await resBookings.json();
      }

      const formattedData = [];
      for (const pay of payments) {
        const rezervare = pay.rezervare || pay.Rezervare || {};
        const teren = pay.teren || pay.Teren || {};
        const baza = pay.bazaSportiva || pay.BazaSportiva || {};
        const extrase = pay.extraServicii || pay.ExtraServicii || [];

        const idRez = rezervare.idRezervare || rezervare.id;

        const bookingMatch = bookings.find(
          (b) =>
            String(b.idRezervare || b.id || b.id_rezervare) === String(idRez),
        );
        if (!bookingMatch && activeTab !== "all") continue;

        const backendStatus = bookingMatch
          ? bookingMatch.status || bookingMatch.Status
          : "ACTIV";
        const sportName = deduceSportName(teren);
        const sportConfig = getSportConfig(sportName);

        let orasString = baza.oras || "Oraș necunoscut";
        if (typeof orasString === "object")
          orasString = orasString.nume || "Oraș";

        formattedData.push({
          id: idRez,
          paymentId: pay.idPayment || pay.id || "N/A",
          venueName: teren.numeTeren || `Teren Sportiv`,
          location: `${orasString}, ${baza.adresa || "Adresă indisponibilă"}`,
          sport: sportConfig.name,
          icon: sportConfig.icon,
          color: sportConfig.color,
          date: rezervare.data || pay.dataEmitere || "-",
          time:
            rezervare.oraStart && rezervare.oraFinal
              ? `${formatTime(rezervare.oraStart)} - ${formatTime(rezervare.oraFinal)}`
              : "-",
          price: pay.totalPlata ? `${pay.totalPlata} RON` : "-",
          status: mapStatus(backendStatus),
          image: sportConfig.img,
          extraServices: extrase,
        });
      }

      setRealBookings(formattedData);
    } catch (err) {
      console.error(err);
      showToast("error", "Nu am putut încărca datele de la server.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCancelModal = (id) => {
    setBookingToCancel(id);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    try {
      const bookingBaseUrl =
        getBaseUrl(API_URLS.BOOKING) || "http://localhost:8082";

      const response = await fetch(
        `${bookingBaseUrl}/api/rezervari/${bookingToCancel}/anulare`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        showToast("success", "Rezervarea a fost anulată cu succes!");
        fetchData();
      } else {
        const errText = await response.text();
        showToast(
          "error",
          `Nu s-a putut anula! Eroare: ${errText || "Rezervare indisponibilă."}`,
        );
      }
    } catch (error) {
      console.error("Eroare:", error);
      showToast("error", "Eroare de rețea la anulare.");
    } finally {
      setIsCancelModalOpen(false);
      setBookingToCancel(null);
    }
  };

  return (
    <Box
      position="relative"
      minH="100vh"
      bg={DS.colors.canvas}
      overflow="hidden"
      mt={{ base: -6, md: -10 }}
      mb={{ base: "-80px", md: -10 }}
      mx={{ base: -4, md: -10, lg: -16 }}
      py={{ base: 10, md: 16 }}
      px={{ base: 4, md: 8 }}
    >
      {customToast.isOpen && (
        <Box
          position="fixed"
          top={{ base: "20px", md: "40px" }}
          right={{ base: "5%", md: "40px" }}
          zIndex={10000}
          w={{ base: "90%", md: "auto" }}
          minW="300px"
          bg={
            customToast.type === "success" ? DS.colors.brand : DS.colors.danger
          }
          borderRadius="2xl"
          p={4}
          boxShadow="0 25px 50px -12px rgba(0,0,0,0.8)"
          display="flex"
          alignItems="center"
          gap={4}
          animation="popIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards"
          sx={{
            "@keyframes popIn": {
              "0%": { opacity: 0, transform: "translateY(-20px) scale(0.95)" },
              "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
            },
          }}
        >
          <Flex
            align="center"
            justify="center"
            boxSize="40px"
            borderRadius="full"
            flexShrink={0}
            bg="blackAlpha.200"
            color={DS.colors.canvas}
          >
            <Icon
              as={customToast.type === "success" ? FiCheckCircle : FiXCircle}
              boxSize={5}
            />
          </Flex>
          <Text
            color={DS.colors.canvas}
            fontWeight="800"
            fontSize="sm"
            lineHeight="1.4"
          >
            {customToast.message}
          </Text>
        </Box>
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

      <Box
        position="relative"
        zIndex={1}
        maxW="900px"
        mx="auto"
        pt={{ base: 4, md: 8 }}
      >
        <VStack align="flex-start" mb={10} spacing={2}>
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            fontWeight="900"
            color={DS.colors.text}
            letterSpacing="-1px"
          >
            Rezervările tale
          </Text>
          <Text fontSize="md" color={DS.colors.muted} fontWeight="500">
            Aici găsești tot istoricul activității tale și meciurile viitoare.
          </Text>
        </VStack>

        <Flex
          direction={{ base: "column", md: "row" }}
          justify="flex-start"
          align={{ base: "stretch", md: "center" }}
          mb={8}
          gap={4}
        >
          <Flex
            overflowX="auto"
            gap={3}
            pb={{ base: 2, md: 0 }}
            sx={{
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                h="44px"
                px={6}
                borderRadius="full"
                bg={activeTab === tab.id ? DS.colors.text : "transparent"}
                color={
                  activeTab === tab.id ? DS.colors.canvas : DS.colors.muted
                }
                border="1px solid"
                borderColor={
                  activeTab === tab.id ? DS.colors.text : "whiteAlpha.200"
                }
                fontWeight="800"
                fontSize="sm"
                flexShrink={0}
                onClick={() => setActiveTab(tab.id)}
                _hover={{
                  bg: activeTab === tab.id ? DS.colors.text : "whiteAlpha.100",
                  color:
                    activeTab === tab.id ? DS.colors.canvas : DS.colors.text,
                }}
                transition={DS.transition}
              >
                {tab.label}
              </Button>
            ))}
          </Flex>
        </Flex>

        {loading ? (
          <Flex justify="center" align="center" py={20}>
            <Spinner size="xl" color={DS.colors.brand} thickness="4px" />
          </Flex>
        ) : realBookings.length > 0 ? (
          <Grid templateColumns="1fr" gap={6}>
            {realBookings.map((booking) => (
              <PremiumBookingCard
                key={booking.id}
                booking={booking}
                onCancelClick={handleOpenCancelModal}
                onAlert={showToast}
              />
            ))}
          </Grid>
        ) : (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={20}
            opacity={0.6}
          >
            <Box p={5} bg="whiteAlpha.50" borderRadius="full" mb={4}>
              <FiXCircle size={40} color={DS.colors.muted} />
            </Box>
            <Text color={DS.colors.text} fontWeight="800" fontSize="xl" mb={1}>
              Nicio rezervare
            </Text>
            <Text fontSize="sm" color={DS.colors.muted} textAlign="center">
              Nu s-a găsit nicio rezervare pentru acest status din backend.
            </Text>
          </Flex>
        )}
      </Box>

      {isCancelModalOpen && (
        <Box
          position="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Box
            position="absolute"
            top={0}
            left={0}
            w="full"
            h="full"
            bg="blackAlpha.800"
            backdropFilter="blur(10px)"
            onClick={() => setIsCancelModalOpen(false)}
          />
          <Box
            position="relative"
            bg={DS.colors.card}
            border={DS.border}
            borderRadius="3xl"
            p={8}
            maxW="400px"
            w="90%"
            textAlign="center"
            boxShadow="0 25px 50px -12px rgba(0,0,0,0.9)"
          >
            <Flex justify="center" mb={4}>
              <Flex
                boxSize="64px"
                bg="rgba(255, 95, 95, 0.1)"
                color={DS.colors.danger}
                borderRadius="full"
                align="center"
                justify="center"
              >
                <FiAlertTriangle size={32} />
              </Flex>
            </Flex>
            <Text fontSize="xl" fontWeight="900" color={DS.colors.text} mb={2}>
              Anulezi rezervarea?
            </Text>
            <Text fontSize="sm" color={DS.colors.muted} mb={8}>
              Ești sigur că vrei să anulezi meciul? Această acțiune este
              ireversibilă.
            </Text>
            <HStack spacing={4}>
              <Button
                flex={1}
                variant="unstyled"
                color={DS.colors.text}
                bg="whiteAlpha.100"
                borderRadius="xl"
                h="48px"
                fontSize="sm"
                fontWeight="700"
                onClick={() => setIsCancelModalOpen(false)}
                _hover={{ bg: "whiteAlpha.200" }}
              >
                Înapoi
              </Button>
              <Button
                flex={1}
                bg={DS.colors.danger}
                color="white"
                borderRadius="xl"
                h="48px"
                fontSize="sm"
                fontWeight="800"
                onClick={handleConfirmCancel}
                _hover={{ opacity: 0.9, transform: "translateY(-2px)" }}
                transition={DS.transition}
              >
                Da, Anulează
              </Button>
            </HStack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default BookingsContent;
