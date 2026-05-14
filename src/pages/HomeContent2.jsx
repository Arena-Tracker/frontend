import React, { useState, useEffect } from "react";
import { Box, Flex, Text, VStack, Input, HStack, Image, Badge, Button, Grid, Icon } from "@chakra-ui/react";
import { 
  FiSearch, FiMapPin, FiStar, FiSliders, FiChevronDown, FiBell, 
  FiSquare, FiCheckSquare, FiX, FiArrowLeft, FiWind, FiBriefcase, FiSun, FiArrowRight
} from "react-icons/fi";
import { FaFutbol, FaBasketballBall, FaParking } from "react-icons/fa";
import { GiTennisRacket, GiVolleyballBall } from "react-icons/gi";

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
  border: "1px solid rgba(255, 255, 255, 0.08)",
  shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
};

// --- MOCK DATA ---
const DUMMY_VENUES = [
  { id: 1, title: "Baza Sportivă Juventus", location: "Berceni, Sector 4", price: 100, rating: "4.8", reviews: 124, image: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1173&auto=format&fit=crop", isNew: false },
  { id: 2, title: "Arena Tineretului Premium", location: "Parcul Tineretului", price: 150, rating: "4.9", reviews: 89, image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1035&auto=format&fit=crop", isNew: true },
  { id: 3, title: "Complex Sportiv Sud", location: "Aparatorii Patriei", price: 120, rating: "4.5", reviews: 42, image: "https://images.unsplash.com/photo-1518605368461-1e12d1b09b55?q=80&w=1170&auto=format&fit=crop", isNew: false },
];

const SPORT_CATEGORIES = [
  { id: 1, name: "Fotbal", icon: FaFutbol, color: "#5ED1BE" }, 
  { id: 2, name: "Baschet", icon: FaBasketballBall, color: "#F97316" }, 
  { id: 3, name: "Tenis", icon: GiTennisRacket, color: "#A855F7" }, 
  { id: 4, name: "Volei", icon: GiVolleyballBall, color: "#3B82F6" }, 
];

const LOCATIONS = [
  "BUCURESTI_SECTOR1", "BUCURESTI_SECTOR2", "BUCURESTI_SECTOR3", "BUCURESTI_SECTOR4", "BUCURESTI_SECTOR5", "BUCURESTI_SECTOR6", "BUFTEA", "CHITILA", "MAGURELE", "OTOPENI", "PANTELIMON", "POPESTI_LEORDENI", "VOLUNTARI", "BRAGADIRU"
];

// GENERATOR DINAMIC DE ORE (Pentru a părea real, simulează ore ocupate/libere în funcție de zi)
const generateTimeSlots = (seedIndex) => {
  return [
    { id: 1, time: "9:00 - 9:59", status: seedIndex % 3 === 0 ? "occupied" : "available" },
    { id: 2, time: "10:00 - 10:59", status: "available" },
    { id: 3, time: "11:00 - 11:59", status: seedIndex % 2 === 0 ? "occupied" : "available" },
    { id: 4, time: "12:00 - 12:59", status: "available" },
    { id: 5, time: "18:00 - 18:59", status: "available" },
    { id: 6, time: "19:00 - 19:59", status: seedIndex % 5 === 0 ? "occupied" : "available" },
    { id: 7, time: "20:00 - 20:59", status: "available" }
  ];
};

// GENERATOR DINAMIC DE ZILE (Pornind de la ziua curentă)
const getDatesForOffset = (offset, count = 5) => {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset + i);
    
    const dayShort = d.toLocaleDateString('ro-RO', { weekday: 'short' });
    const dayNum = d.getDate();
    const monthShort = d.toLocaleDateString('ro-RO', { month: 'short' });
    const fullDateStr = d.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' });
    
    dates.push({
      id: offset + i, // ID unic bazat pe distanța față de azi
      day: dayShort.charAt(0).toUpperCase() + dayShort.slice(1),
      date: `${dayNum} ${monthShort}`,
      fullDate: fullDateStr.charAt(0).toUpperCase() + fullDateStr.slice(1),
      slots: generateTimeSlots(offset + i)
    });
  }
  return dates;
};

// Extrase standard pentru Modal
const MODAL_DATA = {
  facilities: [
    { name: "Dușuri", icon: FiWind, color: "#3B82F6" },
    { name: "Vestiar", icon: FiBriefcase, color: "#D97706" },
    { name: "Parcare", icon: FaParking, color: "#10B981" },
    { name: "Nocturnă", icon: FiSun, color: "#EAB308" }
  ],
  extras: [
    { id: 1, name: "Închiriere minge fotbal PRO", price: 50 },
    { id: 2, name: "Închiriere minge fotbal basic", price: 20 },
    { id: 3, name: "Set echipament", price: 15 },
    { id: 4, name: "Încălzire teren", price: 100 }
  ],
  description: "Terenul oferit de baza sportivă îți pune la dispoziție cele mai bune servicii din București, incluzând balon încălzit, vestiar modern, tribună și multe altele pentru o experiență premium."
};


/**
 * @component BookingModal - Versiunea SUPREMĂ Widescreen & Calendar Nativ
 */
const BookingModal = ({ venue, isOpen, onClose }) => {
  // Calendar State
  const [visibleOffset, setVisibleOffset] = useState(0); // Câte zile sărim de la ziua curentă (ex: 5 = săptămâna viitoare)
  const [activeDateId, setActiveDateId] = useState(0);   // ID-ul zilei selectate activ
  
  // Selections
  const [selectedRange, setSelectedRange] = useState([]); // Indexurile orelor selectate
  const [selectedExtras, setSelectedExtras] = useState([]);

  // Resetăm stările ori de câte ori închidem/deschidem fereastra
  useEffect(() => {
    if (isOpen) {
      setVisibleOffset(0);
      setActiveDateId(0);
      setSelectedRange([]);
      setSelectedExtras([]);
    }
  }, [isOpen]);

  if (!isOpen || !venue) return null;

  // Generăm blocul curent de zile bazat pe vizibilitate
  const visibleDates = getDatesForOffset(visibleOffset, 5);
  
  // Găsim detaliile zilei selectate (sau o luăm pe prima din cele vizibile dacă nu e selectată valid)
  const activeDateObj = visibleDates.find(d => d.id === activeDateId) || visibleDates[0];
  const currentSlots = activeDateObj.slots;

  // Navigare Calendar
  const handleNextDates = () => setVisibleOffset(prev => prev + 5);
  const handlePrevDates = () => setVisibleOffset(prev => Math.max(0, prev - 5));

  // Schimbare Zi Active (Resetează orele la schimbarea zilei)
  const handleDateClick = (id) => {
    setActiveDateId(id);
    setSelectedRange([]);
  };

  // Logica pentru Range Selection Orare
  const handleSlotClick = (idx) => {
    if (currentSlots[idx].status !== "available") return;

    if (selectedRange.length === 0 || selectedRange.length > 1) {
      setSelectedRange([idx]);
    } else {
      const first = selectedRange[0];
      const last = idx;
      const min = Math.min(first, last);
      const max = Math.max(first, last);

      let isValidRange = true;
      const newRange = [];
      
      for (let i = min; i <= max; i++) {
        if (currentSlots[i].status !== "available") {
          isValidRange = false;
          break;
        }
        newRange.push(i);
      }

      if (isValidRange) {
        setSelectedRange(newRange);
      } else {
        setSelectedRange([idx]);
      }
    }
  };

  // Extra Servicii
  const toggleExtra = (id) => {
    if (selectedExtras.includes(id)) {
      setSelectedExtras(selectedExtras.filter(e => e !== id));
    } else {
      setSelectedExtras([...selectedExtras, id]);
    }
  };

  // Calcul Dinamic Total
  const extraTotal = selectedExtras.reduce((sum, extraId) => {
    const extra = MODAL_DATA.extras.find(e => e.id === extraId);
    return sum + (extra ? extra.price : 0);
  }, 0);
  const timeSlotPrice = selectedRange.length * (parseInt(venue.price) || 0);
  const finalTotal = timeSlotPrice + extraTotal;

  return (
    <Box position="fixed" top={0} left={0} w="100vw" h="100vh" zIndex={9999} display="flex" alignItems="center" justifyContent="center">
      {/* Overlay Blur */}
      <Box position="absolute" top={0} left={0} w="full" h="full" bg="blackAlpha.800" backdropFilter="blur(15px)" onClick={onClose} />
      
      {/* Container Principal WIDESCREEN */}
      <Flex 
        direction="column" position="relative" bg={DS.colors.canvas} 
        border={{ base: "none", lg: DS.border }} borderRadius={{ base: "0", lg: "3xl" }} 
        w="full" maxW={{ base: "100%", lg: "1150px" }} h={{ base: "100vh", lg: "88vh" }} 
        overflow="hidden" boxShadow={DS.shadow}
      >
        
        {/* ZONA DE CONȚINUT (Scrollable) - Împărțită în 2 pe Desktop */}
        <Flex direction={{ base: "column", lg: "row" }} flex="1" overflowY="auto" sx={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}>
          
          {/* COLOANA STÂNGA (Imagine & Informații) */}
          <Box w={{ base: "100%", lg: "40%" }} borderRight={{ base: "none", lg: DS.border }} bg="rgba(22, 24, 28, 0.3)">
            <Box position="relative" h={{ base: "260px", lg: "350px" }} w="full" flexShrink={0}>
              <Image src={venue.image} objectFit="cover" w="full" h="full" />
              <Box position="absolute" bottom={0} left={0} w="full" h="70%" bg="linear-gradient(to top, #0B0C0E 0%, transparent 100%)" />
              <Flex as="button" position="absolute" top={6} left={4} boxSize="44px" bg="blackAlpha.500" backdropFilter="blur(10px)" color="white" borderRadius="full" align="center" justify="center" onClick={onClose} transition={DS.transition} _hover={{ bg: DS.colors.brand, color: "black" }}>
                <FiArrowLeft size={22} />
              </Flex>
              {/* Dots */}
              <Flex position="absolute" bottom={4} w="full" justify="center" gap={2}>
                <Box boxSize="6px" bg={DS.colors.brand} borderRadius="full" /><Box boxSize="6px" bg="whiteAlpha.500" borderRadius="full" /><Box boxSize="6px" bg="whiteAlpha.500" borderRadius="full" />
              </Flex>
            </Box>

            <VStack align="stretch" p={{ base: 6, lg: 8 }} spacing={8}>
              <Box>
                <Text fontSize={{ base: "3xl", lg: "4xl" }} fontWeight="900" color={DS.colors.text} lineHeight="1.1" letterSpacing="-1px">{venue.title}</Text>
                <Flex align="center" gap={2} color={DS.colors.muted} mt={3}>
                  <FiMapPin size={16} />
                  <Text fontSize="md" fontWeight="600">{venue.location}</Text>
                </Flex>
              </Box>

              <Flex justify="space-between" align="center">
                {MODAL_DATA.facilities.map((fac, idx) => (
                  <VStack key={idx} spacing={2}>
                    <Flex boxSize="54px" bg="whiteAlpha.50" borderRadius="full" align="center" justify="center" color={fac.color} border="1px solid" borderColor="whiteAlpha.100">
                      <Icon as={fac.icon} size={22} />
                    </Flex>
                    <Text fontSize="11px" fontWeight="700" color={DS.colors.text}>{fac.name}</Text>
                  </VStack>
                ))}
              </Flex>

              <Box display={{ base: "none", lg: "block" }}>
                <Text fontSize="xl" fontWeight="800" color={DS.colors.text} mb={4}>Descriere și regulament</Text>
                <Text fontSize="md" color={DS.colors.muted} lineHeight="1.7">{MODAL_DATA.description}</Text>
              </Box>
            </VStack>
          </Box>

          {/* COLOANA DREAPTA (Calendar, Ore, Extra Servicii) */}
          <Box w={{ base: "100%", lg: "60%" }} p={{ base: 6, lg: 10 }} bg={DS.colors.canvas}>
            
            {/* CALENDAR FUNCȚIONAL CONTINUU */}
            <Box mb={10}>
              <Text fontSize="2xl" fontWeight="800" color={DS.colors.text} mb={5} letterSpacing="-0.5px">Verifică disponibilitatea</Text>
              
              <Box bg={DS.colors.card} border="1px solid" borderColor="whiteAlpha.100" borderRadius="3xl" p={{ base: 5, md: 6 }}>
                
                {/* Header Navigare Zile */}
                <Flex justify="space-between" align="center" mb={6}>
                  <Flex as="button" boxSize="36px" borderRadius="full" align="center" justify="center" bg="whiteAlpha.50" _hover={{ bg: "whiteAlpha.200" }} isDisabled={visibleOffset === 0} opacity={visibleOffset === 0 ? 0.3 : 1} cursor={visibleOffset === 0 ? "not-allowed" : "pointer"} onClick={handlePrevDates} transition={DS.transition}>
                    <FiArrowLeft color={DS.colors.text} />
                  </Flex>
                  <Text fontSize="lg" fontWeight="800" color={DS.colors.text}>{activeDateObj.fullDate}</Text>
                  <Flex as="button" boxSize="36px" borderRadius="full" align="center" justify="center" bg="whiteAlpha.50" _hover={{ bg: "whiteAlpha.200" }} cursor="pointer" onClick={handleNextDates} transition={DS.transition}>
                    <FiArrowRight color={DS.colors.text} />
                  </Flex>
                </Flex>
                
                {/* Zilele (Horizontal List) */}
                <Flex justify="space-between" gap={3} mb={8}>
                  {visibleDates.map((d) => {
                    const isSelected = activeDateId === d.id;
                    return (
                      <VStack 
                        key={d.id} spacing={1} flex={1} py={3} cursor="pointer"
                        bg={isSelected ? "rgba(94, 209, 190, 0.08)" : "transparent"}
                        border="1px solid" borderColor={isSelected ? DS.colors.brand : "whiteAlpha.100"}
                        borderRadius="xl" transition={DS.transition} onClick={() => handleDateClick(d.id)}
                        _hover={{ borderColor: isSelected ? DS.colors.brand : "whiteAlpha.300" }}
                      >
                        <Text fontSize="xs" fontWeight="700" color={isSelected ? DS.colors.brand : DS.colors.muted}>{d.day}</Text>
                        <Text fontSize="md" fontWeight="900" color={isSelected ? DS.colors.brand : DS.colors.text}>{d.date}</Text>
                      </VStack>
                    );
                  })}
                </Flex>

                {/* Lista Ore (Slots) */}
                <VStack align="stretch" spacing={0}>
                  {currentSlots.map((slot, idx) => {
                    const isAvailable = slot.status === "available";
                    const isSelected = selectedRange.includes(idx);
                    
                    return (
                      <Flex 
                        key={slot.id} justify="space-between" align="center" py={4}
                        borderBottom={idx !== currentSlots.length - 1 ? "1px solid" : "none"} borderColor="whiteAlpha.50"
                        cursor={isAvailable ? "pointer" : "not-allowed"} opacity={isAvailable ? 1 : 0.4}
                        onClick={() => handleSlotClick(idx)}
                        _hover={isAvailable ? { bg: "whiteAlpha.50", px: 4, mx: -4, borderRadius: "lg" } : {}}
                        transition="all 0.2s"
                      >
                        <Text fontSize="lg" fontWeight="800" color={DS.colors.text} w="120px">{slot.time}</Text>
                        
                        <Flex align="center" justify="flex-start" gap={3} flex={1}>
                          <Box boxSize="8px" bg={isAvailable ? DS.colors.brand : DS.colors.danger} borderRadius="full" />
                          <Text fontSize="sm" fontWeight="700" color={DS.colors.text}>{isAvailable ? "Disponibil" : "Ocupat"}</Text>
                        </Flex>

                        <Flex align="center" justify="flex-end" gap={4} w="120px">
                          <Text fontSize="lg" fontWeight="800" color={isAvailable ? DS.colors.brand : DS.colors.muted}>{venue.price}RON</Text>
                          {isAvailable && (
                            <Box color={isSelected ? DS.colors.brand : DS.colors.muted} transition={DS.transition}>
                              {isSelected ? <FiCheckSquare size={22} /> : <FiSquare size={22} />}
                            </Box>
                          )}
                        </Flex>
                      </Flex>
                    );
                  })}
                </VStack>
              </Box>
            </Box>

            {/* EXTRA SERVICII */}
            <Box mb={{ base: 8, lg: 0 }}>
              <Text fontSize="2xl" fontWeight="800" color={DS.colors.text} mb={5} letterSpacing="-0.5px">Extra servicii</Text>
              <VStack align="stretch" spacing={4}>
                {MODAL_DATA.extras.map((extra) => {
                  const isSelected = selectedExtras.includes(extra.id);
                  return (
                    <Flex 
                      key={extra.id} justify="space-between" align="center" bg={DS.colors.card} 
                      border="1px solid" borderColor={isSelected ? DS.colors.brand : "whiteAlpha.100"} 
                      borderRadius="2xl" p={5} cursor="pointer" transition={DS.transition}
                      onClick={() => toggleExtra(extra.id)} _hover={{ borderColor: DS.colors.brand }}
                    >
                      <Text fontSize="md" fontWeight="700" color={DS.colors.text}>{extra.name}</Text>
                      <Flex align="center" gap={5}>
                        <Text fontSize="lg" fontWeight="800" color={DS.colors.brand}>{extra.price}RON</Text>
                        <Box color={isSelected ? DS.colors.brand : DS.colors.muted}>
                          {isSelected ? <FiCheckSquare size={22} /> : <FiSquare size={22} />}
                        </Box>
                      </Flex>
                    </Flex>
                  );
                })}
              </VStack>
            </Box>

            {/* DESCRIERE (Apare doar la final pe mobil) */}
            <Box display={{ base: "block", lg: "none" }} mt={8}>
              <Text fontSize="xl" fontWeight="800" color={DS.colors.text} mb={4}>Descriere și regulament</Text>
              <Box bg={DS.colors.card} p={6} borderRadius="2xl" border="1px solid" borderColor="whiteAlpha.100">
                <Text fontSize="md" color={DS.colors.muted} lineHeight="1.7">{MODAL_DATA.description}</Text>
              </Box>
            </Box>

          </Box>
        </Flex>

        {/* STICKY FOOTER: ABSOLUT FIXAT JOS */}
        <Box flexShrink={0} w="full" bg="rgba(11, 12, 14, 0.98)" backdropFilter="blur(20px)" borderTop="1px solid" borderColor="whiteAlpha.100" p={{ base: 5, lg: 6 }} zIndex={10}>
          <Button 
            w="full" h="64px" bg={DS.colors.brand} color="black" borderRadius="2xl" fontSize="xl" fontWeight="900" transition={DS.transition}
            isDisabled={selectedRange.length === 0} _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
            onClick={() => {
              alert(`Rezervare finalizată! Total plătit: ${finalTotal} RON.`);
              onClose();
            }}
          >
            Total: {finalTotal > 0 ? `${finalTotal} RON` : "0 RON"}
          </Button>
        </Box>

      </Flex>
    </Box>
  );
};


// ----------------------------------------------------
// COMPONENTELE PAGINII PRINCIPALE (AFIȘARE)
// ----------------------------------------------------

const PremiumSportCard = ({ sport }) => {
  const IconComponent = sport.icon;
  return (
    <Flex direction="column" align="center" justify="center" bg={DS.colors.card} border={DS.border} borderRadius="2xl" minW="100px" h="100px" gap={3} cursor="pointer" transition={DS.transition} _hover={{ transform: "translateY(-4px)", borderColor: sport.color, boxShadow: `0 8px 20px -5px ${sport.color}40` }}>
      <Box color={sport.color}><IconComponent size={28} /></Box>
      <Text fontSize="xs" fontWeight="700" color={DS.colors.text}>{sport.name}</Text>
    </Flex>
  );
};

const PremiumVenueCard = ({ venue, onReserve }) => (
  <Box minW={{ base: "280px", md: "320px" }} bg={DS.colors.card} borderRadius="2xl" overflow="hidden" border={DS.border} cursor="pointer" transition={DS.transition} _hover={{ transform: "translateY(-4px)", boxShadow: DS.shadow, borderColor: "whiteAlpha.200" }}>
    <Box position="relative" h="160px" w="full">
      <Image src={venue.image} alt={venue.title} objectFit="cover" w="full" h="full" loading="lazy" />
      <Box position="absolute" top={0} left={0} w="full" h="full" bg="linear-gradient(180deg, rgba(0,0,0,0) 50%, #16181C 100%)" />
      <Flex position="absolute" top={3} w="full" px={3} justify="space-between">
        {venue.isNew ? <Badge bg={DS.colors.brand} color={DS.colors.canvas} px={2} py={1} borderRadius="lg" fontSize="10px" fontWeight="900">NOU</Badge> : <Box />}
        <Flex bg="blackAlpha.700" backdropFilter="blur(4px)" px={2} py={1} borderRadius="lg" align="center" gap={1.5}><FiStar color="#F9F871" fill="#F9F871" size={12} /><Text color="white" fontSize="11px" fontWeight="800">{venue.rating}</Text></Flex>
      </Flex>
    </Box>
    <VStack align="stretch" p={4} spacing={3}>
      <Box>
        <Text fontSize="md" fontWeight="800" color={DS.colors.text} noOfLines={1}>{venue.title}</Text>
        <Flex align="center" gap={1.5} mt={1} color={DS.colors.muted}><FiMapPin size={12} /><Text fontSize="xs" fontWeight="600" isTruncated>{venue.location}</Text></Flex>
      </Box>
      <Flex justify="space-between" align="center" pt={2} borderTop="1px solid" borderColor="whiteAlpha.100">
        <VStack align="start" spacing={0}><Text fontSize="10px" color={DS.colors.muted} fontWeight="700">PREȚ / ORĂ</Text><Text fontSize="sm" color={DS.colors.brand} fontWeight="900">{venue.price} RON</Text></VStack>
        <Button size="sm" bg="whiteAlpha.100" color={DS.colors.text} borderRadius="xl" fontSize="12px" fontWeight="800" _hover={{ bg: DS.colors.brand, color: DS.colors.canvas }} transition={DS.transition} onClick={(e) => { e.stopPropagation(); onReserve(venue); }}>Rezervă</Button>
      </Flex>
    </VStack>
  </Box>
);

const SectionLayout = ({ title, children }) => (
  <Box w="full" mb={8}>
    <Flex justify="space-between" align="flex-end" mb={2} px={{ base: 4, md: 8 }}><Text fontSize="lg" fontWeight="900" color={DS.colors.text} letterSpacing="-0.5px">{title}</Text><Text fontSize="xs" fontWeight="700" color={DS.colors.brand} cursor="pointer" _hover={{ textDecoration: "underline" }} transition="all 0.2s">Vezi toate</Text></Flex>
    <Flex overflowX="auto" gap={4} px={{ base: 4, md: 8 }} py={4} sx={{ "&::-webkit-scrollbar": { display: "none" }, "-ms-overflow-style": "none", "scrollbar-width": "none" }}>{children}</Flex>
  </Box>
);

const PremiumDropdown = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (val) => { onChange(val); setIsOpen(false); };
  const selectedOption = options.find(o => o.value === value);
  const buttonLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <Box position="relative" w="full">
      <Flex bg="blackAlpha.400" border="1px solid" borderColor={isOpen ? DS.colors.brand : "whiteAlpha.100"} borderRadius="xl" h="36px" px={3} align="center" justify="space-between" cursor="pointer" onClick={() => setIsOpen(!isOpen)} transition={DS.transition} _hover={{ borderColor: isOpen ? DS.colors.brand : "whiteAlpha.300" }}>
        <HStack spacing={2} maxW="calc(100% - 20px)" isTruncated><Box color={selectedOption ? DS.colors.brand : DS.colors.muted}>{selectedOption ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}</Box><Text fontSize="sm" fontWeight="600" color={selectedOption ? DS.colors.text : DS.colors.muted} isTruncated>{buttonLabel}</Text></HStack>
        <FiChevronDown color={DS.colors.muted} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }} />
      </Flex>
      {isOpen && (
        <Box position="absolute" top="calc(100% + 6px)" left="0" w="full" zIndex={20} bg={DS.colors.card} border="1px solid" borderColor="whiteAlpha.100" borderRadius="xl" boxShadow="0 25px 50px -12px rgba(0,0,0,0.8)" maxH="250px" overflowY="auto" py={2} sx={{ "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { bg: "whiteAlpha.200", borderRadius: "full" } }}>
          <Flex px={4} py={2.5} cursor="pointer" onClick={() => handleSelect("")} _hover={{ color: DS.colors.brand }} transition={DS.transition} color={!selectedOption ? DS.colors.brand : DS.colors.text}><HStack spacing={2}><Box color={!selectedOption ? DS.colors.brand : DS.colors.muted}>{!selectedOption ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}</Box><Text fontSize="sm" fontWeight="600">{placeholder}</Text></HStack></Flex>
          {options.map((opt) => (
            <Flex key={opt.value} px={4} py={2.5} cursor="pointer" onClick={() => handleSelect(opt.value)} _hover={{ color: DS.colors.brand }} transition={DS.transition} color={value === opt.value ? DS.colors.brand : DS.colors.text}><HStack spacing={2}><Box color={value === opt.value ? DS.colors.brand : DS.colors.muted}>{value === opt.value ? <FiCheckSquare size={16} /> : <FiSquare size={16} />}</Box><Text fontSize="sm" fontWeight="600" isTruncated>{opt.label}</Text></HStack></Flex>
          ))}
        </Box>
      )}
    </Box>
  );
};

const HomeContent = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSportFilter, setSelectedSportFilter] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [venueToBook, setVenueToBook] = useState(null);

  const formattedLocations = LOCATIONS.map(loc => ({ label: loc.replace(/_/g, ' '), value: loc }));

  return (
    <Box position="relative" minH="100vh" bg={DS.colors.canvas} overflow="hidden" mt={{ base: -6, md: -10 }} mb={{ base: "-80px", md: -10 }} mx={{ base: -4, md: -10, lg: -16 }} py={{ base: 10, md: 16 }}>
      
      <Box position="absolute" top="-10%" left="-10%" w="70vw" h="70vw" bg="radial-gradient(circle, rgba(94, 209, 190, 0.08) 0%, transparent 60%)" zIndex="0" pointerEvents="none" />
      <Box position="absolute" bottom="20%" right="-10%" w="70vw" h="70vw" bg="radial-gradient(circle, rgba(41, 128, 185, 0.08) 0%, transparent 60%)" zIndex="0" pointerEvents="none" />

      <Box position="relative" zIndex={1} maxW="1200px" mx="auto">
        
        <Flex justify="space-between" align="center" px={{ base: 4, md: 8 }} mb={8}>
          <Box><Text fontSize="sm" color={DS.colors.muted} fontWeight="700">Salutare, Alexandru! 👋</Text><Text fontSize="2xl" color={DS.colors.text} fontWeight="900" letterSpacing="-1px">Găsește terenul perfect</Text></Box>
          <Flex as="button" boxSize="44px" align="center" justify="center" bg={DS.colors.card} border={DS.border} borderRadius="xl" color={DS.colors.text} transition={DS.transition} _hover={{ bg: "whiteAlpha.200" }}><FiBell size={20} /></Flex>
        </Flex>

        <Box px={{ base: 4, md: 8 }} mb={10}>
          <Flex align="center" bg="rgba(22, 24, 28, 0.7)" backdropFilter="blur(10px)" borderRadius={showFilters ? "2xl 2xl 0 0" : "2xl"} px={5} h="64px" border="1px solid" borderColor="whiteAlpha.100" borderBottomColor={showFilters ? "transparent" : "whiteAlpha.100"} boxShadow="0 10px 30px -10px rgba(0,0,0,0.3)" transition={DS.transition} _focusWithin={{ borderColor: DS.colors.brand, bg: DS.colors.input }} position="relative" zIndex={3} gap={3}>
            <Box color={DS.colors.muted}><FiSearch size={20} /></Box><Input placeholder="Caută după nume..." border="none" bg="transparent" color={DS.colors.text} fontSize="md" fontWeight="600" _placeholder={{ color: "whiteAlpha.400" }} _focus={{ outline: "none", boxShadow: "none" }} />
            <Box w="1px" h="50%" bg="whiteAlpha.200" />
            <Box as="button" color={showFilters ? DS.colors.brand : DS.colors.muted} cursor="pointer" onClick={() => setShowFilters(!showFilters)} transition="all 0.2s" _hover={{ color: DS.colors.brand }} display="flex" alignItems="center" justifyContent="center"><FiSliders size={20} /></Box>
          </Flex>
          <Box display="grid" gridTemplateRows={showFilters ? "1fr" : "0fr"} transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)" opacity={showFilters ? 1 : 0} position="relative" zIndex={2}>
            <Box overflow={showFilters ? "visible" : "hidden"}>
              <Box bg="rgba(22, 24, 28, 0.85)" backdropFilter="blur(15px)" p={5} borderRadius="0 0 2xl 2xl" border="1px solid" borderColor="whiteAlpha.100" borderTop="none" boxShadow="0 20px 40px -10px rgba(0,0,0,0.5)">
                <Flex direction={{ base: "column", md: "row" }} gap={6} mb={5}>
                  <Box flex={1}>
                    <Text fontSize="10px" fontWeight="800" color={DS.colors.muted} letterSpacing="1px" mb={2}>CATEGORIE</Text>
                    <Flex wrap="wrap" gap={2}>
                      {SPORT_CATEGORIES.map(sport => <Button key={sport.id} size="sm" h="36px" px={4} bg={selectedSportFilter === sport.id ? "transparent" : "transparent"} color={selectedSportFilter === sport.id ? DS.colors.brand : DS.colors.text} border="1px solid" borderColor={selectedSportFilter === sport.id ? DS.colors.brand : "whiteAlpha.200"} borderRadius="xl" fontWeight="700" onClick={() => setSelectedSportFilter(sport.id === selectedSportFilter ? null : sport.id)} _hover={{ borderColor: selectedSportFilter === sport.id ? DS.colors.brand : "whiteAlpha.400" }} transition={DS.transition}>{sport.name}</Button>)}
                    </Flex>
                  </Box>
                  <Box flex={1}>
                    <Text fontSize="10px" fontWeight="800" color={DS.colors.muted} letterSpacing="1px" mb={2}>LOCAȚIE</Text>
                    <PremiumDropdown value={selectedLocation} options={formattedLocations} onChange={setSelectedLocation} placeholder="Toate locațiile" />
                  </Box>
                </Flex>
                <HStack spacing={4}>
                  <Button flex={1} variant="unstyled" color={DS.colors.text} bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100" h="40px" borderRadius="lg" fontWeight="700" fontSize="xs" onClick={() => { setSelectedSportFilter(null); setSelectedLocation(""); }} _hover={{ bg: "whiteAlpha.200" }} transition={DS.transition}>Resetează</Button>
                  <Button flex={1} bg={DS.colors.brand} color={DS.colors.card} h="40px" borderRadius="lg" fontWeight="800" fontSize="xs" onClick={() => setShowFilters(false)} _hover={{ opacity: 0.9, transform: "translateY(-1px)" }} transition={DS.transition}>Aplică filtre</Button>
                </HStack>
              </Box>
            </Box>
          </Box>
        </Box>

        <SectionLayout title="Sporturi" showViewAll={false}>
          {SPORT_CATEGORIES.map((sport) => <PremiumSportCard key={sport.id} sport={sport} />)}
        </SectionLayout>

        <SectionLayout title="Recomandate pentru tine">
          {DUMMY_VENUES.map((venue) => <PremiumVenueCard key={venue.id} venue={venue} onReserve={setVenueToBook} />)}
        </SectionLayout>

        <SectionLayout title="Populare în zona ta">
          {[...DUMMY_VENUES].reverse().map((venue) => <PremiumVenueCard key={`pop-${venue.id}`} venue={venue} onReserve={setVenueToBook} />)}
        </SectionLayout>

      </Box>

      {/* RENDER MODALUL DE REZERVARE DETALIAT ȘI RESPONSIV */}
      <BookingModal venue={venueToBook} isOpen={!!venueToBook} onClose={() => setVenueToBook(null)} />

    </Box>
  );
};

export default HomeContent;