import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  Image,
  Icon,
  Button,
  Spinner,
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiWind,
  FiBriefcase,
  FiSun,
  FiSquare,
  FiCheckSquare,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { FaFutbol, FaParking } from "react-icons/fa";

// ==========================================
// CONFIGURĂRI API & MEDIU
// ==========================================
const BOOKING_API_URL =
  import.meta.env.VITE_BOOKING_SERVICE_URL || "http://localhost:8081/api";
const ID_USER_CURENT = 1;

// Design System Local
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

const MODAL_DATA = {
  facilities: [
    { name: "Dușuri", icon: FiWind, color: "#3B82F6" },
    { name: "Vestiar", icon: FiBriefcase, color: "#D97706" },
    { name: "Parcare", icon: FaParking, color: "#10B981" },
    { name: "Nocturnă", icon: FiSun, color: "#EAB308" },
  ],
  extras: [
    { id: 1, name: "Minge Fotbal PRO", price: 20, icon: FaFutbol },
    { id: 2, name: "Set Echipament", price: 40, icon: FiBriefcase },
    { id: 3, name: "Încălzire teren", price: 100, icon: FiSun },
  ],
};

// Generăm zilele calendaristice (păstrând și formatul RAW pentru backend)
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

// ATENȚIE: Adăugăm showGlobalToast ca prop!
const BookingModal = ({ venue, isOpen, onClose, showGlobalToast }) => {
  const [step, setStep] = useState(1);
  const [visibleOffset, setVisibleOffset] = useState(0);
  const [activeDateId, setActiveDateId] = useState(0);

  const [currentSlots, setCurrentSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedRange, setSelectedRange] = useState([]);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

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
      setToastMessage(null);
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
        console.error("Nu am putut prelua intervalele:", error);
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

  const showToast = (title, description, status = "success") => {
    setToastMessage({ title, description, status });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNextDates = () => setVisibleOffset((prev) => prev + 5);
  const handlePrevDates = () =>
    setVisibleOffset((prev) => Math.max(0, prev - 5));

  const handleDateClick = (id) => {
    setActiveDateId(id);
  };

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
    (sum, id) => sum + (MODAL_DATA.extras.find((e) => e.id === id)?.price || 0),
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

  // --- POST REZERVARE CĂTRE BACKEND ---
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const minIdx = Math.min(...selectedRange);
      const maxIdx = Math.max(...selectedRange);

      const oraStart = currentSlots[minIdx].time.split(" - ")[0];
      const oraFinal = currentSlots[maxIdx].time.split(" - ")[1];

      const requestBody = {
        data: activeDateObj.rawDate,
        oraStart: `${oraStart}:00`,
        oraFinal: `${oraFinal}:00`,
        idTeren: venue.id,
        userId: ID_USER_CURENT,
        idsExtraServicii: selectedExtras,
      };

      const response = await fetch(`${BOOKING_API_URL}/rezervari`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Eroare la crearea rezervării");
      }

      // ÎNCHIDERE INSTANTANEE ȘI DELEGARE CĂTRE PĂRINTE!
      onClose();
      if (showGlobalToast) {
        showGlobalToast(
          "Rezervare finalizată!",
          "Factura și detaliile au fost salvate cu succes.",
          "success",
        );
      }
    } catch (error) {
      console.error(error);
      if (showGlobalToast) {
        showGlobalToast(
          "Eroare",
          "Nu am putut finaliza rezervarea. Încearcă din nou.",
          "error",
        );
      } else {
        showToast(
          "Eroare",
          "Nu am putut finaliza rezervarea. Încearcă din nou.",
          "error",
        );
      }
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

      {/* COLOANA DREAPTA (Calendar) */}
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
                    onClick={() => handleDateClick(d.id)}
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
            {MODAL_DATA.extras.map((extra) => {
              const isSelected = selectedExtras.includes(extra.id);
              return (
                <Flex
                  key={extra.id}
                  justify="space-between"
                  align="center"
                  bg={DS.colors.card}
                  border="1px solid"
                  borderColor={isSelected ? DS.colors.brand : "whiteAlpha.100"}
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
                    <Box color={isSelected ? DS.colors.brand : DS.colors.muted}>
                      {isSelected ? (
                        <FiCheckSquare size={22} />
                      ) : (
                        <FiSquare size={22} />
                      )}
                    </Box>
                  </Flex>
                </Flex>
              );
            })}
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
                const ex = MODAL_DATA.extras.find((e) => e.id === id);
                return (
                  <Flex key={id} justify="space-between" align="center">
                    <Flex align="center" gap={3}>
                      <Icon as={ex.icon} color={DS.colors.muted} />
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
      {/* CUSTOM TOAST LOCAL (Fallback pt cand nu avem Global Toast) */}
      {!showGlobalToast && toastMessage && (
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

export default BookingModal;
