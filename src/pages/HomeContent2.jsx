import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  HStack,
  Image,
  Badge,
  Button,
  VStack,
  Icon,
  Spinner,
  Grid,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMapPin,
  FiStar,
  FiSliders,
  FiChevronDown,
  FiBell,
  FiSquare,
  FiCheckSquare,
  FiArrowLeft,
  FiArrowRight,
  FiWind,
  FiBriefcase,
  FiSun,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { FaFutbol, FaBasketballBall, FaParking } from "react-icons/fa";
import { GiTennisRacket, GiVolleyballBall } from "react-icons/gi";
import { getCurrentUser } from "../utils/auth";
// ==========================================
// CONFIGURĂRI API & MEDIU
// ==========================================
const COURT_API_URL =
  import.meta.env.VITE_COURT_SERVICE_URL || "http://localhost:8082/api";
const USERS_API_URL =
  import.meta.env.VITE_USERS_SERVICE_URL || "http://localhost:8083/api";
const BOOKING_API_URL =
  import.meta.env.VITE_BOOKING_SERVICE_URL || "http://localhost:8081/api";

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
  border: "1px solid rgba(255, 255, 255, 0.08)",
  shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
};

const SPORT_CATEGORIES = [
  { id: 1, name: "Fotbal", icon: FaFutbol, color: "#5ED1BE" },
  { id: 2, name: "Baschet", icon: FaBasketballBall, color: "#F97316" },
  { id: 3, name: "Tenis", icon: GiTennisRacket, color: "#A855F7" },
  { id: 4, name: "Volei", icon: GiVolleyballBall, color: "#3B82F6" },
];

const LOCATIONS = [
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

const MODAL_DATA = {
  facilities: [
    { name: "Dușuri", icon: FiWind, color: "#3B82F6" },
    { name: "Vestiar", icon: FiBriefcase, color: "#D97706" },
    { name: "Parcare", icon: FaParking, color: "#10B981" },
    { name: "Nocturnă", icon: FiSun, color: "#EAB308" },
  ],
};

// ==========================================
// FUNCȚII CALENDAR
// ==========================================
const getDatesForOffset = (offset, count = 5) => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset + i);

    const dayShort = d.toLocaleDateString("ro-RO", { weekday: "short" });
    const dayNum = d.getDate();
    const monthShort = d.toLocaleDateString("ro-RO", { month: "short" });
    const fullDateStr = d.toLocaleDateString("ro-RO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    dates.push({
      id: offset + i,
      day: dayShort.charAt(0).toUpperCase() + dayShort.slice(1),
      dayNum: dayNum,
      monthShort: monthShort,
      date: `${dayNum} ${monthShort}`,
      fullDate: fullDateStr.charAt(0).toUpperCase() + fullDateStr.slice(1),
      rawDate: `${yyyy}-${mm}-${dd}`,
    });
  }
  return dates;
};

// ==========================================
// COMPONENTA MODAL REZERVARE
// ==========================================
const BookingModal = ({ venue, isOpen, onClose, showGlobalToast }) => {
  const [step, setStep] = useState(1);
  const [visibleOffset, setVisibleOffset] = useState(0);
  const [activeDateId, setActiveDateId] = useState(0);

  const [currentSlots, setCurrentSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedRange, setSelectedRange] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const currentUser = getCurrentUser();
  const DYNAMIC_ID = currentUser ? currentUser.id : 1;
  // Extragem serviciile extra DIN BACKEND (din terenul selectat)
  const dynamicExtras = useMemo(() => {
    if (!venue?.originalData?.servicii) return [];
    return venue.originalData.servicii.map((srv, idx) => ({
      id: srv.id || idx + 1, // Fallback la index+1 daca nu exista ID in ExtraServiciuDTO
      name: srv.nume || srv.denumire,
      price: srv.pret || 0,
    }));
  }, [venue]);

  const visibleDates = useMemo(
    () => getDatesForOffset(visibleOffset, 5),
    [visibleOffset],
  );
  const activeDateObj = useMemo(
    () => visibleDates.find((d) => d.id === activeDateId) || visibleDates[0],
    [visibleDates, activeDateId],
  );

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setVisibleOffset(0);
      setActiveDateId(0);
      setSelectedRange([]);
      setSelectedExtras([]);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchIntervals = async () => {
      if (!isOpen || !venue) return;

      setIsLoadingSlots(true);
      setSelectedRange([]);

      try {
        const response = await fetch(
          `${BOOKING_API_URL}/rezervari/teren/${venue.id}/intervale?data=${activeDateObj.rawDate}`,
        );
        let availableFromApi = [];
        if (response.ok) {
          availableFromApi = await response.json();
        }

        const allSlots = [];
        for (let h = 8; h <= 22; h++) {
          const startH = String(h).padStart(2, "0");
          const endH = String(h).padStart(2, "0");
          const timeString = `${startH}:00 - ${endH}:59`;

          const isAvailable = availableFromApi.some((apiSlot) => {
            const apiStart = apiSlot.OraStart || apiSlot.oraStart;
            return apiStart && apiStart.startsWith(`${startH}:00`);
          });

          allSlots.push({
            id: h,
            time: timeString,
            status: isAvailable ? "available" : "occupied",
          });
        }

        setCurrentSlots(allSlots);
      } catch (error) {
        const fallback = [];
        for (let h = 8; h <= 22; h++)
          fallback.push({
            id: h,
            time: `${String(h).padStart(2, "0")}:00 - ${String(h).padStart(2, "0")}:59`,
            status: "occupied",
          });
        setCurrentSlots(fallback);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchIntervals();
  }, [activeDateId, isOpen, venue, activeDateObj.rawDate]);

  if (!isOpen || !venue) return null;

  const handleNextDates = () => setVisibleOffset((prev) => prev + 5);
  const handlePrevDates = () =>
    setVisibleOffset((prev) => Math.max(0, prev - 5));

  const handleSlotClick = (idx) => {
    if (currentSlots[idx].status !== "available") return;

    if (selectedRange.length === 0 || selectedRange.length > 1) {
      setSelectedRange([idx]);
    } else {
      const min = Math.min(selectedRange[0], idx);
      const max = Math.max(selectedRange[0], idx);
      let isValidRange = true;
      const newRange = [];
      for (let i = min; i <= max; i++) {
        if (currentSlots[i].status !== "available") {
          isValidRange = false;
          break;
        }
        newRange.push(i);
      }
      setSelectedRange(isValidRange ? newRange : [idx]);
    }
  };

  const toggleExtra = (id) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  };

  const extraTotal = selectedExtras.reduce(
    (sum, id) => sum + (dynamicExtras.find((e) => e.id === id)?.price || 0),
    0,
  );
  const timeSlotPrice = selectedRange.length * (parseInt(venue.price) || 0);
  const finalTotal = timeSlotPrice + extraTotal;

  const getSelectedTimeString = () => {
    if (selectedRange.length === 0) return "";
    const minIdx = Math.min(...selectedRange);
    const maxIdx = Math.max(...selectedRange);
    const startTime = currentSlots[minIdx].time.split(" - ")[0];
    const endTime = currentSlots[maxIdx].time.split(" - ")[1];
    return `${startTime} - ${endTime}`;
  };

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const minIdx = Math.min(...selectedRange);
      const maxIdx = Math.max(...selectedRange);
      const oraStart = currentSlots[minIdx].time.split(" - ")[0];
      const oraFinal = currentSlots[maxIdx].time.split(" - ")[1];
      console.log(DYNAMIC_ID);
      const requestBody = {
        data: activeDateObj.rawDate,
        oraStart: `${oraStart}:00`,
        oraFinal: `${oraFinal}:00`,
        idTeren: venue.id,
        userId: DYNAMIC_ID,
        idsExtraServicii: selectedExtras,
      };

      const response = await fetch(`${BOOKING_API_URL}/rezervari`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("Eroare la crearea rezervării");

      // ÎNCHIDEM MODALUL INSTANT ȘI AFIȘĂM TOAST-UL GLOBAL
      onClose();
      showGlobalToast(
        "Rezervare finalizată!",
        "Factura și detaliile au fost salvate cu succes.",
        "success",
      );
    } catch (error) {
      console.error(error);
      showGlobalToast(
        "Eroare",
        "Nu am putut finaliza rezervarea. Încearcă din nou.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep1 = () => (
    <Flex
      direction={{ base: "column", lg: "row" }}
      flex="1"
      overflowY={{ base: "auto", lg: "hidden" }}
      sx={{ "&::-webkit-scrollbar": { display: "none" } }}
    >
      <Box
        w={{ base: "100%", lg: "40%" }}
        flexShrink={0}
        bg={DS.colors.card}
        borderRight={{ base: "none", lg: DS.border }}
        position="relative"
      >
        <Box position="relative" h={{ base: "250px", lg: "350px" }} w="full">
          <Image src={venue.image} objectFit="cover" w="full" h="full" />
          <Box
            position="absolute"
            inset={0}
            bg="linear-gradient(to top, #16181C 0%, transparent 80%)"
          />
          <Flex
            as="button"
            position="absolute"
            top={6}
            left={6}
            boxSize="44px"
            bg="blackAlpha.500"
            backdropFilter="blur(10px)"
            color="white"
            borderRadius="full"
            align="center"
            justify="center"
            onClick={onClose}
            transition={DS.transition}
            _hover={{ bg: DS.colors.brand, color: "black" }}
          >
            <FiArrowLeft size={22} />
          </Flex>
        </Box>

        <VStack
          align="stretch"
          px={{ base: 6, lg: 10 }}
          pb={{ base: 6, lg: 10 }}
          mt={{ base: "-40px", lg: "-80px" }}
          position="relative"
          zIndex={2}
          spacing={0}
        >
          <Box mb={6}>
            <Text
              fontSize={{ base: "3xl", lg: "4xl" }}
              fontWeight="900"
              color={DS.colors.text}
              lineHeight="1.1"
              letterSpacing="-1px"
            >
              {venue.title}
            </Text>
            <Flex align="center" gap={2} color={DS.colors.muted} mt={2}>
              <FiMapPin size={16} />
              <Text fontSize="md" fontWeight="600">
                {venue.location}
              </Text>
            </Flex>
          </Box>

          <Box p={5} borderRadius="2xl" border={DS.border} bg="transparent">
            <Flex justify="space-between" align="center">
              {MODAL_DATA.facilities.map((fac, idx) => (
                <VStack key={idx} spacing={3}>
                  <Flex
                    boxSize={{ base: "48px", lg: "56px" }}
                    bg="#22252A"
                    borderRadius="full"
                    align="center"
                    justify="center"
                    color={fac.color}
                  >
                    <Icon as={fac.icon} boxSize={{ base: 5, lg: 6 }} />
                  </Flex>
                  <Text
                    fontSize={{ base: "9px", lg: "11px" }}
                    fontWeight="800"
                    color="white"
                    textTransform="uppercase"
                  >
                    {fac.name}
                  </Text>
                </VStack>
              ))}
            </Flex>
          </Box>
        </VStack>
      </Box>

      <Box
        w={{ base: "100%", lg: "60%" }}
        p={{ base: 6, lg: 10 }}
        pb={{ base: 32, lg: 24 }}
        bg={DS.colors.canvas}
        overflowY={{ base: "visible", lg: "auto" }}
        sx={{ "&::-webkit-scrollbar": { display: "none" } }}
      >
        <Box mb={10}>
          <Text
            fontSize={{ base: "xl", lg: "2xl" }}
            fontWeight="800"
            color={DS.colors.text}
            mb={5}
            letterSpacing="-0.5px"
          >
            Verifică disponibilitatea
          </Text>
          <Box
            bg={DS.colors.card}
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius="3xl"
            p={{ base: 4, md: 6 }}
          >
            <Flex justify="space-between" align="center" mb={6}>
              <Flex
                as="button"
                boxSize="36px"
                borderRadius="full"
                align="center"
                justify="center"
                bg="whiteAlpha.50"
                _hover={{ bg: "whiteAlpha.200" }}
                isDisabled={visibleOffset === 0}
                opacity={visibleOffset === 0 ? 0.3 : 1}
                cursor={visibleOffset === 0 ? "not-allowed" : "pointer"}
                onClick={handlePrevDates}
                transition={DS.transition}
              >
                <FiArrowLeft color={DS.colors.text} />
              </Flex>
              <Text fontSize="lg" fontWeight="800" color={DS.colors.text}>
                {activeDateObj.fullDate}
              </Text>
              <Flex
                as="button"
                boxSize="36px"
                borderRadius="full"
                align="center"
                justify="center"
                bg="whiteAlpha.50"
                _hover={{ bg: "whiteAlpha.200" }}
                cursor="pointer"
                onClick={handleNextDates}
                transition={DS.transition}
              >
                <FiArrowRight color={DS.colors.text} />
              </Flex>
            </Flex>

            <Flex justify="space-between" gap={2} mb={8}>
              {visibleDates.map((d) => {
                const isSelected = activeDateId === d.id;
                return (
                  <VStack
                    key={d.id}
                    spacing={1}
                    flex={1}
                    py={3}
                    cursor="pointer"
                    bg={isSelected ? "rgba(94, 209, 190, 0.08)" : "transparent"}
                    border="1px solid"
                    borderColor={
                      isSelected ? DS.colors.brand : "whiteAlpha.100"
                    }
                    borderRadius="xl"
                    transition={DS.transition}
                    onClick={() => setActiveDateId(d.id)}
                    _hover={{
                      borderColor: isSelected
                        ? DS.colors.brand
                        : "whiteAlpha.300",
                    }}
                  >
                    <Text
                      fontSize={{ base: "10px", md: "xs" }}
                      fontWeight="700"
                      color={isSelected ? DS.colors.brand : DS.colors.muted}
                    >
                      {d.day}
                    </Text>
                    <Text
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="900"
                      color={isSelected ? DS.colors.brand : DS.colors.text}
                    >
                      {d.dayNum}
                      <Box
                        as="span"
                        display={{ base: "none", sm: "inline" }}
                        ml={1}
                      >
                        {d.monthShort}
                      </Box>
                    </Text>
                  </VStack>
                );
              })}
            </Flex>

            {isLoadingSlots ? (
              <Flex justify="center" align="center" py={10}>
                <Spinner color={DS.colors.brand} size="lg" />
              </Flex>
            ) : (
              <VStack align="stretch" spacing={0}>
                {currentSlots.map((slot, idx) => {
                  const isAvailable = slot.status === "available";
                  const isSelected = selectedRange.includes(idx);
                  return (
                    <Flex
                      key={slot.id}
                      justify="space-between"
                      align="center"
                      py={4}
                      borderBottom={
                        idx !== currentSlots.length - 1 ? "1px solid" : "none"
                      }
                      borderColor="whiteAlpha.50"
                      cursor={isAvailable ? "pointer" : "not-allowed"}
                      opacity={isAvailable ? 1 : 0.4}
                      onClick={() => handleSlotClick(idx)}
                      _hover={
                        isAvailable
                          ? {
                              bg: "whiteAlpha.50",
                              px: 4,
                              mx: -4,
                              borderRadius: "lg",
                            }
                          : {}
                      }
                      transition="all 0.2s"
                    >
                      <Text
                        fontSize={{ base: "sm", md: "lg" }}
                        fontWeight="800"
                        color={DS.colors.text}
                        w={{ base: "90px", md: "120px" }}
                      >
                        {slot.time}
                      </Text>
                      <Flex align="center" gap={{ base: 2, md: 3 }} flex={1}>
                        <Box
                          boxSize={{ base: "6px", md: "8px" }}
                          bg={isAvailable ? DS.colors.brand : DS.colors.danger}
                          borderRadius="full"
                        />
                        <Text
                          fontSize={{ base: "xs", md: "sm" }}
                          fontWeight="700"
                          color={DS.colors.text}
                        >
                          {isAvailable ? "Disponibil" : "Ocupat"}
                        </Text>
                      </Flex>
                      <Flex
                        align="center"
                        justify="flex-end"
                        gap={{ base: 2, md: 4 }}
                        w={{ base: "90px", md: "120px" }}
                      >
                        <Text
                          fontSize={{ base: "sm", md: "lg" }}
                          fontWeight="800"
                          color={
                            isAvailable ? DS.colors.brand : DS.colors.muted
                          }
                        >
                          {venue.price}RON
                        </Text>
                        {isAvailable && (
                          <Box
                            color={
                              isSelected ? DS.colors.brand : DS.colors.muted
                            }
                            transition={DS.transition}
                          >
                            {isSelected ? (
                              <FiCheckSquare size={20} />
                            ) : (
                              <FiSquare size={20} />
                            )}
                          </Box>
                        )}
                      </Flex>
                    </Flex>
                  );
                })}
              </VStack>
            )}
          </Box>
        </Box>

        <Box>
          <Text
            fontSize={{ base: "xl", lg: "2xl" }}
            fontWeight="800"
            color={DS.colors.text}
            mb={5}
            letterSpacing="-0.5px"
          >
            Extra servicii
          </Text>
          <VStack align="stretch" spacing={4}>
            {dynamicExtras.length > 0 ? (
              dynamicExtras.map((extra) => {
                const isSelected = selectedExtras.includes(extra.id);
                return (
                  <Flex
                    key={extra.id}
                    justify="space-between"
                    align="center"
                    bg={DS.colors.card}
                    border="1px solid"
                    borderColor={
                      isSelected ? DS.colors.brand : "whiteAlpha.100"
                    }
                    borderRadius="2xl"
                    p={5}
                    cursor="pointer"
                    transition={DS.transition}
                    onClick={() => toggleExtra(extra.id)}
                    _hover={{ borderColor: DS.colors.brand }}
                  >
                    <Text fontSize="md" fontWeight="700" color={DS.colors.text}>
                      {extra.name}
                    </Text>
                    <Flex align="center" gap={5}>
                      <Text
                        fontSize="lg"
                        fontWeight="800"
                        color={DS.colors.brand}
                      >
                        {extra.price}RON
                      </Text>
                      <Box
                        color={isSelected ? DS.colors.brand : DS.colors.muted}
                      >
                        {isSelected ? (
                          <FiCheckSquare size={22} />
                        ) : (
                          <FiSquare size={22} />
                        )}
                      </Box>
                    </Flex>
                  </Flex>
                );
              })
            ) : (
              <Text color={DS.colors.muted} fontSize="sm">
                Acest teren nu dispune de servicii extra momentan.
              </Text>
            )}
          </VStack>
        </Box>
      </Box>

      <Box
        position="absolute"
        bottom={0}
        left={0}
        w="full"
        bg="rgba(11, 12, 14, 0.95)"
        backdropFilter="blur(20px)"
        borderTop={DS.border}
        p={{ base: 4, md: 5 }}
        zIndex={10}
      >
        <Flex
          justify="space-between"
          align="center"
          maxW={{ base: "100%", lg: "1150px" }}
          mx="auto"
        >
          <VStack
            align="start"
            spacing={0}
            display={{ base: "none", md: "flex" }}
          >
            <Text
              fontSize="xs"
              color={DS.colors.muted}
              fontWeight="700"
              letterSpacing="1px"
              textTransform="uppercase"
            >
              Total estimativ
            </Text>
            <Text fontSize="2xl" color={DS.colors.text} fontWeight="900">
              {finalTotal} RON
            </Text>
          </VStack>
          <Button
            w={{ base: "full", md: "auto" }}
            minW="250px"
            h={{ base: "50px", md: "54px" }}
            bg={DS.colors.brand}
            color="black"
            borderRadius="xl"
            fontSize="lg"
            fontWeight="900"
            transition={DS.transition}
            isDisabled={selectedRange.length === 0}
            pointerEvents={selectedRange.length === 0 ? "none" : "auto"}
            opacity={selectedRange.length === 0 ? 0.5 : 1}
            onClick={() => {
              if (selectedRange.length === 0) return;
              setStep(2);
            }}
            rightIcon={<FiArrowRight />}
          >
            {selectedRange.length === 0 ? "Selectează ora" : "Continuă"}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );

  const renderStep2 = () => (
    <Box
      flex="1"
      bg={DS.colors.canvas}
      overflowY="auto"
      position="relative"
      sx={{ "&::-webkit-scrollbar": { display: "none" } }}
    >
      <Flex
        p={6}
        align="center"
        gap={4}
        borderBottom={DS.border}
        bg={DS.colors.card}
      >
        <Flex
          as="button"
          boxSize="40px"
          bg="whiteAlpha.100"
          borderRadius="full"
          align="center"
          justify="center"
          onClick={() => setStep(1)}
          _hover={{ bg: "whiteAlpha.200" }}
          transition={DS.transition}
        >
          <FiArrowLeft color="white" />
        </Flex>
        <Text fontSize="xl" fontWeight="800" color="white">
          Confirmă rezervarea
        </Text>
      </Flex>

      <Box maxW="500px" mx="auto" p={6} pb={24}>
        <Box position="relative" borderRadius="3xl" mb={6}>
          <Box
            position="absolute"
            inset={0}
            bg={DS.colors.brand}
            filter="blur(20px)"
            opacity={0.15}
            borderRadius="3xl"
            zIndex={0}
          />
          <Flex
            position="relative"
            zIndex={1}
            bg={DS.colors.card}
            border={DS.border}
            p={5}
            borderRadius="3xl"
            gap={4}
          >
            <Image
              src={venue.image}
              boxSize="80px"
              borderRadius="xl"
              objectFit="cover"
            />
            <VStack align="start" spacing={1} flex={1}>
              <Text
                fontSize="md"
                fontWeight="800"
                color="white"
                lineHeight="1.2"
                mb={1}
              >
                {venue.title}
              </Text>
              <Flex align="center" color={DS.colors.muted}>
                <Icon as={FiCalendar} mr={1.5} size={14} />
                <Text fontSize="sm" fontWeight="600">
                  {activeDateObj.date}
                </Text>
              </Flex>
              <Flex align="center" color={DS.colors.muted}>
                <Icon as={FiClock} mr={1.5} size={14} />
                <Text fontSize="sm" fontWeight="600">
                  {getSelectedTimeString()}
                </Text>
              </Flex>
              <Flex
                justify="space-between"
                w="full"
                mt={2}
                pt={2}
                borderTop="1px solid"
                borderColor="whiteAlpha.100"
              >
                <Text fontSize="xs" color="yellow.400" fontWeight="800">
                  ★ {venue.rating}
                </Text>
                <Text fontSize="xs" color={DS.colors.brand} fontWeight="800">
                  {timeSlotPrice} RON / {selectedRange.length}h
                </Text>
              </Flex>
            </VStack>
          </Flex>
        </Box>

        {selectedExtras.length > 0 && (
          <Box
            bg={DS.colors.card}
            border={DS.border}
            borderRadius="2xl"
            p={5}
            mb={6}
          >
            <Text fontSize="md" fontWeight="800" color="white" mb={4}>
              Echipament & Servicii
            </Text>
            <VStack align="stretch" spacing={4}>
              {selectedExtras.map((id) => {
                const ex = dynamicExtras.find((e) => e.id === id);
                return (
                  <Flex key={id} justify="space-between" align="center">
                    <Flex align="center" gap={3}>
                      <Icon as={FiBriefcase} color={DS.colors.muted} />
                      <Text
                        color={DS.colors.muted}
                        fontSize="sm"
                        fontWeight="600"
                      >
                        {ex.name}
                      </Text>
                    </Flex>
                    <Text color="white" fontSize="sm" fontWeight="700">
                      {ex.price} RON
                    </Text>
                  </Flex>
                );
              })}
            </VStack>
          </Box>
        )}

        <Box
          bg={DS.colors.card}
          border={DS.border}
          borderRadius="2xl"
          p={5}
          mb={6}
        >
          <Text fontSize="md" fontWeight="800" color="white" mb={4}>
            Metoda de Plată
          </Text>
          <Flex
            direction="column"
            gap={1}
            p={4}
            borderRadius="xl"
            border="1px solid"
            bg="rgba(94, 209, 190, 0.05)"
            borderColor="whiteAlpha.100"
          >
            <Flex align="flex-start" gap={4}>
              <Flex
                boxSize="36px"
                bg="rgba(94, 209, 190, 0.15)"
                borderRadius="full"
                align="center"
                justify="center"
                color={DS.colors.brand}
                flexShrink={0}
              >
                <Icon as={FiDollarSign} size={18} />
              </Flex>
              <Box>
                <Text color="white" fontWeight="800" fontSize="sm" mb={1}>
                  Plată NUMERAR la locație
                </Text>
                <Text fontSize="xs" color={DS.colors.muted} lineHeight="1.5">
                  Plata se va efectua exclusiv numerar înainte de intrarea pe
                  teren. Nu există opțiune de plată cu cardul online.
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>

        <Box
          bg={DS.colors.card}
          border={DS.border}
          borderRadius="2xl"
          p={5}
          mb={6}
        >
          <Text fontSize="md" fontWeight="800" color="white" mb={4}>
            Rezumat Rezervare
          </Text>
          <VStack align="stretch" spacing={3} mb={4}>
            <Flex justify="space-between">
              <Text color={DS.colors.muted} fontSize="sm">
                Teren ({selectedRange.length}h)
              </Text>
              <Text color="white" fontSize="sm" fontWeight="700">
                {timeSlotPrice} RON
              </Text>
            </Flex>
            {extraTotal > 0 && (
              <Flex justify="space-between">
                <Text color={DS.colors.muted} fontSize="sm">
                  Echipament & Servicii
                </Text>
                <Text color="white" fontSize="sm" fontWeight="700">
                  {extraTotal} RON
                </Text>
              </Flex>
            )}
          </VStack>
          <Box borderTop="1px dashed" borderColor="whiteAlpha.200" pt={4}>
            <Flex justify="space-between" align="center">
              <Text color="white" fontSize="xl" fontWeight="900">
                Total:
              </Text>
              <Text color={DS.colors.brand} fontSize="2xl" fontWeight="900">
                {finalTotal} RON
              </Text>
            </Flex>
          </Box>
        </Box>

        <VStack spacing={4}>
          <Button
            w="full"
            h="64px"
            bg={DS.colors.brand}
            color="black"
            borderRadius="xl"
            fontSize="xl"
            fontWeight="900"
            isLoading={isSubmitting}
            loadingText="Se procesează..."
            onClick={handleConfirmBooking}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: `0 10px 25px -10px ${DS.colors.brand}`,
            }}
            transition={DS.transition}
          >
            CONFIRMĂ REZERVAREA
          </Button>
        </VStack>
      </Box>
    </Box>
  );

  return (
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
        backdropFilter="blur(15px)"
        onClick={onClose}
      />
      <Flex
        direction="column"
        position="relative"
        bg={DS.colors.canvas}
        border={{ base: "none", lg: DS.border }}
        borderRadius={{ base: "0", lg: "3xl" }}
        w={{ base: "100%", lg: step === 1 ? "1150px" : "600px" }}
        h={{ base: "100vh", lg: "88vh" }}
        overflow="hidden"
        boxShadow={DS.shadow}
        transition="width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      >
        {step === 1 ? renderStep1() : renderStep2()}
      </Flex>
    </Box>
  );
};

// ==========================================
// COMPONENTE SECUNDARE
// ==========================================
const PremiumSportCard = ({ sport }) => {
  const IconComponent = sport.icon;
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      bg={DS.colors.card}
      border={DS.border}
      borderRadius="2xl"
      minW="100px"
      h="100px"
      gap={3}
      cursor="pointer"
      transition={DS.transition}
      _hover={{
        transform: "translateY(-4px)",
        borderColor: sport.color,
        boxShadow: `0 8px 20px -5px ${sport.color}40`,
      }}
    >
      <Box color={sport.color}>
        <IconComponent size={28} />
      </Box>
      <Text fontSize="xs" fontWeight="700" color={DS.colors.text}>
        {sport.name}
      </Text>
    </Flex>
  );
};

const PremiumVenueCard = ({ venue, onReserve }) => (
  <Box
    minW={{ base: "280px", md: "320px" }}
    bg={DS.colors.card}
    borderRadius="2xl"
    overflow="hidden"
    border={DS.border}
    cursor="pointer"
    transition={DS.transition}
    _hover={{
      transform: "translateY(-4px)",
      boxShadow: DS.shadow,
      borderColor: "whiteAlpha.200",
    }}
  >
    <Box position="relative" h="160px" w="full">
      <Image
        src={venue.image}
        alt={venue.title}
        objectFit="cover"
        w="full"
        h="full"
        loading="lazy"
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        bg="linear-gradient(180deg, rgba(0,0,0,0) 50%, #16181C 100%)"
      />
      <Flex position="absolute" top={3} w="full" px={3} justify="space-between">
        {venue.isNew ? (
          <Badge
            bg={DS.colors.brand}
            color={DS.colors.canvas}
            px={2}
            py={1}
            borderRadius="lg"
            fontSize="10px"
            fontWeight="900"
          >
            NOU
          </Badge>
        ) : (
          <Box />
        )}
        <Flex
          bg="blackAlpha.700"
          backdropFilter="blur(4px)"
          px={2}
          py={1}
          borderRadius="lg"
          align="center"
          gap={1.5}
        >
          <FiStar color="#F9F871" fill="#F9F871" size={12} />
          <Text color="white" fontSize="11px" fontWeight="800">
            {venue.rating}
          </Text>
        </Flex>
      </Flex>
    </Box>
    <VStack align="stretch" p={4} spacing={3}>
      <Box>
        <Text
          fontSize="md"
          fontWeight="800"
          color={DS.colors.text}
          noOfLines={1}
        >
          {venue.title}
        </Text>
        <Flex align="center" gap={1.5} mt={1} color={DS.colors.muted}>
          <FiMapPin size={12} />
          <Text fontSize="xs" fontWeight="600" isTruncated>
            {venue.location}
          </Text>
        </Flex>
      </Box>
      <Flex
        justify="space-between"
        align="center"
        pt={2}
        borderTop="1px solid"
        borderColor="whiteAlpha.100"
      >
        <VStack align="start" spacing={0}>
          <Text fontSize="10px" color={DS.colors.muted} fontWeight="700">
            PREȚ / ORĂ
          </Text>
          <Text fontSize="sm" color={DS.colors.brand} fontWeight="900">
            {venue.price} RON
          </Text>
        </VStack>
        <Button
          size="sm"
          bg="whiteAlpha.100"
          color={DS.colors.text}
          borderRadius="xl"
          fontSize="12px"
          fontWeight="800"
          _hover={{ bg: DS.colors.brand, color: DS.colors.canvas }}
          transition={DS.transition}
          onClick={(e) => {
            e.stopPropagation();
            onReserve(venue);
          }}
        >
          Rezervă
        </Button>
      </Flex>
    </VStack>
  </Box>
);

const SectionLayout = ({
  title,
  children,
  showViewAll = true,
  viewAllPath,
}) => {
  const navigate = useNavigate();
  return (
    <Box w="full" mb={8}>
      <Flex
        justify="space-between"
        align="flex-end"
        mb={2}
        px={{ base: 4, md: 8 }}
      >
        <Text
          fontSize="lg"
          fontWeight="900"
          color={DS.colors.text}
          letterSpacing="-0.5px"
        >
          {title}
        </Text>
        {showViewAll && viewAllPath && (
          <Text
            fontSize="xs"
            fontWeight="700"
            color={DS.colors.brand}
            cursor="pointer"
            onClick={() => navigate(viewAllPath)}
            _hover={{ textDecoration: "underline" }}
            transition="all 0.2s"
          >
            Vezi toate
          </Text>
        )}
      </Flex>
      <Flex
        overflowX="auto"
        gap={4}
        px={{ base: 4, md: 8 }}
        py={4}
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        }}
      >
        {children}
      </Flex>
    </Box>
  );
};

const PremiumDropdown = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };
  const selectedOption = options.find((o) => o.value === value);
  const buttonLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <Box position="relative" w="full">
      <Flex
        bg="blackAlpha.400"
        border="1px solid"
        borderColor={isOpen ? DS.colors.brand : "whiteAlpha.100"}
        borderRadius="xl"
        h="36px"
        px={3}
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        transition={DS.transition}
        _hover={{ borderColor: isOpen ? DS.colors.brand : "whiteAlpha.300" }}
      >
        <HStack spacing={2} maxW="calc(100% - 20px)" isTruncated>
          <Box color={selectedOption ? DS.colors.brand : DS.colors.muted}>
            {selectedOption ? (
              <FiCheckSquare size={16} />
            ) : (
              <FiSquare size={16} />
            )}
          </Box>
          <Text
            fontSize="sm"
            fontWeight="600"
            color={selectedOption ? DS.colors.text : DS.colors.muted}
            isTruncated
          >
            {buttonLabel}
          </Text>
        </HStack>
        <FiChevronDown
          color={DS.colors.muted}
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "0.2s",
          }}
        />
      </Flex>
      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          left="0"
          w="full"
          zIndex={20}
          bg={DS.colors.card}
          border="1px solid"
          borderColor="whiteAlpha.100"
          borderRadius="xl"
          boxShadow="0 25px 50px -12px rgba(0,0,0,0.8)"
          maxH="250px"
          overflowY="auto"
          py={2}
          sx={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              bg: "whiteAlpha.200",
              borderRadius: "full",
            },
          }}
        >
          <Flex
            px={4}
            py={2.5}
            cursor="pointer"
            onClick={() => handleSelect("")}
            _hover={{ color: DS.colors.brand }}
            transition={DS.transition}
            color={!selectedOption ? DS.colors.brand : DS.colors.text}
          >
            <HStack spacing={2}>
              <Box color={!selectedOption ? DS.colors.brand : DS.colors.muted}>
                {!selectedOption ? (
                  <FiCheckSquare size={16} />
                ) : (
                  <FiSquare size={16} />
                )}
              </Box>
              <Text fontSize="sm" fontWeight="600">
                {placeholder}
              </Text>
            </HStack>
          </Flex>
          {options.map((opt) => (
            <Flex
              key={opt.value}
              px={4}
              py={2.5}
              cursor="pointer"
              onClick={() => handleSelect(opt.value)}
              _hover={{ color: DS.colors.brand }}
              transition={DS.transition}
              color={value === opt.value ? DS.colors.brand : DS.colors.text}
            >
              <HStack spacing={2}>
                <Box
                  color={
                    value === opt.value ? DS.colors.brand : DS.colors.muted
                  }
                >
                  {value === opt.value ? (
                    <FiCheckSquare size={16} />
                  ) : (
                    <FiSquare size={16} />
                  )}
                </Box>
                <Text fontSize="sm" fontWeight="600" isTruncated>
                  {opt.label}
                </Text>
              </HStack>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
};

// ==========================================
// COMPONENTA PRINCIPALĂ
// ==========================================
const HomeContent = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSportFilter, setSelectedSportFilter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [venueToBook, setVenueToBook] = useState(null);

  // Stări pentru integrare API & Global Toast
  const [userName, setUserName] = useState("Client");
  const [dbVenues, setDbVenues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const currentUser = getCurrentUser();
  const DYNAMIC_ID = currentUser ? currentUser.id : 1;
  const formattedLocations = LOCATIONS.map((loc) => ({
    label: loc.replace(/_/g, " "),
    value: loc,
  }));

  const showGlobalToast = (title, description, status = "success") => {
    setToastMessage({ title, description, status });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const userRes = await fetch(`${USERS_API_URL}/users/${DYNAMIC_ID}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserName(userData.prenume || userData.nume || "Alexandru");
        }

        const terenuriRes = await fetch(`${COURT_API_URL}/terenuri/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        if (terenuriRes.ok) {
          const data = await terenuriRes.json();
          const mappedVenues = data.map((t) => ({
            id: t.idTeren || t.id,
            title: t.numeTeren,
            location: "București",
            price: t.pretPeOra,
            rating: "5.0",
            reviews: 10,
            image:
              "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1173&auto=format&fit=crop",
            isNew: true,
            originalData: t,
          }));

          setDbVenues(mappedVenues);
        }
      } catch (error) {
        console.error("Eroare la încărcarea datelor Home:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const recomandate = dbVenues.slice(0, 3);
  const populare = dbVenues.slice(0, 3);

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
    >
      {/* GLOBAL TOAST NOTIFICATION */}
      {toastMessage && (
        <Flex
          position="fixed"
          top="4"
          right="4"
          bg={toastMessage.status === "error" ? "#FF5F5F" : "#5ED1BE"}
          color={toastMessage.status === "error" ? "white" : "black"}
          px={6}
          py={4}
          borderRadius="xl"
          boxShadow="xl"
          zIndex={10000}
          alignItems="center"
          gap={4}
          animation="fade-in 0.3s ease-out"
        >
          <Icon
            as={toastMessage.status === "error" ? FiXCircle : FiCheckCircle}
            boxSize={6}
          />
          <Box>
            <Text fontWeight="900" fontSize="sm">
              {toastMessage.title}
            </Text>
            <Text fontSize="xs" fontWeight="600">
              {toastMessage.description}
            </Text>
          </Box>
        </Flex>
      )}

      <Box
        position="absolute"
        top="-10%"
        left="-10%"
        w="70vw"
        h="70vw"
        bg="radial-gradient(circle, rgba(94, 209, 190, 0.08) 0%, transparent 60%)"
        zIndex="0"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="-10%"
        w="70vw"
        h="70vw"
        bg="radial-gradient(circle, rgba(41, 128, 185, 0.08) 0%, transparent 60%)"
        zIndex="0"
        pointerEvents="none"
      />

      <Box position="relative" zIndex={1} maxW="1200px" mx="auto">
        <Flex
          justify="space-between"
          align="center"
          px={{ base: 4, md: 8 }}
          mb={8}
        >
          <Box>
            <Text fontSize="sm" color={DS.colors.muted} fontWeight="700">
              Salutare, {userName}! 👋
            </Text>
            <Text
              fontSize="2xl"
              color={DS.colors.text}
              fontWeight="900"
              letterSpacing="-1px"
            >
              Găsește terenul perfect
            </Text>
          </Box>
          <Flex
            as="button"
            boxSize="44px"
            align="center"
            justify="center"
            bg={DS.colors.card}
            border={DS.border}
            borderRadius="xl"
            color={DS.colors.text}
            transition={DS.transition}
            _hover={{ bg: "whiteAlpha.200" }}
          >
            <FiBell size={20} />
          </Flex>
        </Flex>

        <Box px={{ base: 4, md: 8 }} mb={10}>
          <Flex
            align="center"
            bg="rgba(22, 24, 28, 0.7)"
            backdropFilter="blur(10px)"
            borderRadius={showFilters ? "2xl 2xl 0 0" : "2xl"}
            px={5}
            h="64px"
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderBottomColor={showFilters ? "transparent" : "whiteAlpha.100"}
            boxShadow="0 10px 30px -10px rgba(0,0,0,0.3)"
            transition={DS.transition}
            _focusWithin={{ borderColor: DS.colors.brand, bg: DS.colors.input }}
            position="relative"
            zIndex={3}
            gap={3}
          >
            <Box color={DS.colors.muted}>
              <FiSearch size={20} />
            </Box>
            <Input
              placeholder="Caută după nume..."
              border="none"
              bg="transparent"
              color={DS.colors.text}
              fontSize="md"
              fontWeight="600"
              _placeholder={{ color: "whiteAlpha.400" }}
              _focus={{ outline: "none", boxShadow: "none" }}
            />
            <Box w="1px" h="50%" bg="whiteAlpha.200" />
            <Box
              as="button"
              color={showFilters ? DS.colors.brand : DS.colors.muted}
              cursor="pointer"
              onClick={() => setShowFilters(!showFilters)}
              transition="all 0.2s"
              _hover={{ color: DS.colors.brand }}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <FiSliders size={20} />
            </Box>
          </Flex>
          <Box
            display="grid"
            gridTemplateRows={showFilters ? "1fr" : "0fr"}
            transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            opacity={showFilters ? 1 : 0}
            position="relative"
            zIndex={2}
          >
            <Box overflow={showFilters ? "visible" : "hidden"}>
              <Box
                bg="rgba(22, 24, 28, 0.85)"
                backdropFilter="blur(15px)"
                p={5}
                borderRadius="0 0 2xl 2xl"
                border="1px solid"
                borderColor="whiteAlpha.100"
                borderTop="none"
                boxShadow="0 20px 40px -10px rgba(0,0,0,0.5)"
              >
                <Flex direction={{ base: "column", md: "row" }} gap={6} mb={5}>
                  <Box flex={1}>
                    <Text
                      fontSize="10px"
                      fontWeight="800"
                      color={DS.colors.muted}
                      letterSpacing="1px"
                      mb={2}
                    >
                      CATEGORIE
                    </Text>
                    <Flex wrap="wrap" gap={2}>
                      {SPORT_CATEGORIES.map((sport) => (
                        <Button
                          key={sport.id}
                          size="sm"
                          h="36px"
                          px={4}
                          bg={
                            selectedSportFilter === sport.id
                              ? "transparent"
                              : "transparent"
                          }
                          color={
                            selectedSportFilter === sport.id
                              ? DS.colors.brand
                              : DS.colors.text
                          }
                          border="1px solid"
                          borderColor={
                            selectedSportFilter === sport.id
                              ? DS.colors.brand
                              : "whiteAlpha.200"
                          }
                          borderRadius="xl"
                          fontWeight="700"
                          onClick={() =>
                            setSelectedSportFilter(
                              sport.id === selectedSportFilter
                                ? null
                                : sport.id,
                            )
                          }
                          _hover={{
                            borderColor:
                              selectedSportFilter === sport.id
                                ? DS.colors.brand
                                : "whiteAlpha.400",
                          }}
                          transition={DS.transition}
                        >
                          {sport.name}
                        </Button>
                      ))}
                    </Flex>
                  </Box>
                  <Box flex={1}>
                    <Text
                      fontSize="10px"
                      fontWeight="800"
                      color={DS.colors.muted}
                      letterSpacing="1px"
                      mb={2}
                    >
                      LOCAȚIE
                    </Text>
                    <PremiumDropdown
                      value={selectedLocation}
                      options={formattedLocations}
                      onChange={setSelectedLocation}
                      placeholder="Toate locațiile"
                    />
                  </Box>
                </Flex>
                <HStack spacing={4}>
                  <Button
                    flex={1}
                    variant="unstyled"
                    color={DS.colors.text}
                    bg="whiteAlpha.50"
                    border="1px solid"
                    borderColor="whiteAlpha.100"
                    h="40px"
                    borderRadius="lg"
                    fontWeight="700"
                    fontSize="xs"
                    onClick={() => {
                      setSelectedSportFilter(null);
                      setSelectedLocation("");
                    }}
                    _hover={{ bg: "whiteAlpha.200" }}
                    transition={DS.transition}
                  >
                    Resetează
                  </Button>
                  <Button
                    flex={1}
                    bg={DS.colors.brand}
                    color={DS.colors.card}
                    h="40px"
                    borderRadius="lg"
                    fontWeight="800"
                    fontSize="xs"
                    onClick={() => setShowFilters(false)}
                    _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
                    transition={DS.transition}
                  >
                    Aplică filtre
                  </Button>
                </HStack>
              </Box>
            </Box>
          </Box>
        </Box>

        <SectionLayout title="Sporturi" showViewAll={false}>
          {SPORT_CATEGORIES.map((sport) => (
            <PremiumSportCard key={sport.id} sport={sport} />
          ))}
        </SectionLayout>

        <SectionLayout
          title="Recomandate pentru tine"
          viewAllPath="/user/search/filter/toate?sort=recomandate"
        >
          {isLoading ? (
            <Spinner color={DS.colors.brand} />
          ) : recomandate.length > 0 ? (
            recomandate.map((venue) => (
              <PremiumVenueCard
                key={venue.id}
                venue={venue}
                onReserve={setVenueToBook}
              />
            ))
          ) : (
            <Text color={DS.colors.muted} fontSize="sm">
              Nu există terenuri momentan.
            </Text>
          )}
        </SectionLayout>

        <SectionLayout
          title="Populare în zona ta"
          viewAllPath="/user/search/filter/toate?sort=populare"
        >
          {isLoading ? (
            <Spinner color={DS.colors.brand} />
          ) : populare.length > 0 ? (
            populare.map((venue) => (
              <PremiumVenueCard
                key={`pop-${venue.id}`}
                venue={venue}
                onReserve={setVenueToBook}
              />
            ))
          ) : (
            <Text color={DS.colors.muted} fontSize="sm">
              Nu există terenuri momentan.
            </Text>
          )}
        </SectionLayout>
      </Box>

      {/* MODAL EXTERN CU FUNCTIE DE TOAST */}
      <BookingModal
        venue={venueToBook}
        isOpen={!!venueToBook}
        onClose={() => setVenueToBook(null)}
        showGlobalToast={showGlobalToast}
      />
    </Box>
  );
};

export default HomeContent;
