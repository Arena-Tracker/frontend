import React, { useState } from "react";
import { Box, Flex, Text, VStack, HStack, Image, Badge, Button, Grid, Icon } from "@chakra-ui/react";
import { 
  FiCalendar, FiClock, FiMapPin, FiRefreshCw, FiXCircle, FiCheck, 
  FiMoreHorizontal, FiChevronDown, FiSquare, FiCheckSquare, FiAlertTriangle 
} from "react-icons/fi";
import { FaFutbol, FaBasketballBall, FaTableTennis } from "react-icons/fa";

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
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
};

// --- MOCK DATA ---
const BOOKINGS_DATA = [
  {
    id: "B-1029",
    venueName: "Arena Națională Premium",
    location: "Sector 2, București",
    sport: "Fotbal",
    icon: FaFutbol,
    color: "#5ED1BE",
    date: "Azi, 24 Oct",
    time: "19:00 - 21:00",
    price: "400 RON",
    status: "active", 
    image: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1173&auto=format&fit=crop"
  },
  {
    id: "B-0982",
    venueName: "Baza Sportivă Sud",
    location: "Sector 4, București",
    sport: "Tenis",
    icon: FaTableTennis,
    color: "#A855F7",
    date: "12 Oct 2023",
    time: "10:00 - 12:00",
    price: "120 RON",
    status: "completed",
    image: "https://images.unsplash.com/photo-1518605368461-1e12d1b09b55?q=80&w=1170&auto=format&fit=crop"
  },
  {
    id: "B-0844",
    venueName: "Complex Sportiv Nord",
    location: "Otopeni, Ilfov",
    sport: "Baschet",
    icon: FaBasketballBall,
    color: "#F97316",
    date: "05 Oct 2023",
    time: "18:00 - 20:00",
    price: "150 RON",
    status: "cancelled",
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1035&auto=format&fit=crop"
  }
];

const TABS = [
  { id: "all", label: "Toate" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Finalizate" },
  { id: "cancelled", label: "Anulate" }
];

const SPORT_OPTIONS = [
  { label: "Fotbal", value: "Fotbal" },
  { label: "Tenis", value: "Tenis" },
  { label: "Baschet", value: "Baschet" }
];

/**
 * @component PremiumDropdown
 * Reutilizat pentru filtrarea pe sport
 */
const PremiumDropdown = ({ value, options, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (val) => { onChange(val); setIsOpen(false); };
  const selectedOption = options.find(o => o.value === value);
  const buttonLabel = selectedOption ? selectedOption.label : placeholder;

  return (
    <Box position="relative" w="full">
      <Flex 
        bg="blackAlpha.400" border="1px solid" borderColor={isOpen ? DS.colors.brand : "whiteAlpha.100"} borderRadius="xl"
        h="44px" px={4} align="center" justify="space-between" cursor="pointer" onClick={() => setIsOpen(!isOpen)} transition={DS.transition} _hover={{ borderColor: isOpen ? DS.colors.brand : "whiteAlpha.300" }}
      >
        <HStack spacing={2} maxW="calc(100% - 20px)" isTruncated>
          <Icon as={selectedOption ? FiCheckSquare : FiSquare} boxSize={4} color={selectedOption ? DS.colors.brand : DS.colors.muted} />
          <Text fontSize="sm" fontWeight="600" color={selectedOption ? DS.colors.text : DS.colors.muted} isTruncated>
            {buttonLabel}
          </Text>
        </HStack>
        <FiChevronDown color={DS.colors.muted} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s" }} />
      </Flex>
      
      {isOpen && (
        <Box 
          position="absolute" top="calc(100% + 6px)" left="0" w="full" zIndex={20} 
          bg={DS.colors.card} border="1px solid" borderColor="whiteAlpha.100" 
          borderRadius="xl" boxShadow="0 25px 50px -12px rgba(0,0,0,0.8)" 
          maxH="250px" overflowY="auto" py={2}
          sx={{ "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { bg: "whiteAlpha.200", borderRadius: "full" } }}
        >
          <Flex px={4} py={2.5} cursor="pointer" onClick={() => handleSelect("")} _hover={{ color: DS.colors.brand }} transition={DS.transition} color={!selectedOption ? DS.colors.brand : DS.colors.text}>
             <HStack spacing={2}>
               <Icon as={!selectedOption ? FiCheckSquare : FiSquare} boxSize={4} color={!selectedOption ? DS.colors.brand : DS.colors.muted} />
               <Text fontSize="sm" fontWeight="600">{placeholder}</Text>
             </HStack>
          </Flex>
          {options.map((opt) => (
            <Flex key={opt.value} px={4} py={2.5} cursor="pointer" onClick={() => handleSelect(opt.value)} _hover={{ color: DS.colors.brand }} transition={DS.transition} color={value === opt.value ? DS.colors.brand : DS.colors.text}>
              <HStack spacing={2}>
                 <Icon as={value === opt.value ? FiCheckSquare : FiSquare} boxSize={4} color={value === opt.value ? DS.colors.brand : DS.colors.muted} />
                 <Text fontSize="sm" fontWeight="600" isTruncated>{opt.label}</Text>
              </HStack>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
};

/**
 * @component PremiumBookingCard
 */
const PremiumBookingCard = ({ booking, onCancelClick }) => {
  const SportIcon = booking.icon;

  const getStatusStyles = (status) => {
    switch (status) {
      case "active": return { label: "ACTIV", bg: "rgba(94, 209, 190, 0.15)", color: DS.colors.brand, icon: FiCheck };
      case "completed": return { label: "FINALIZAT", bg: "whiteAlpha.100", color: DS.colors.text, icon: FiCheck };
      case "cancelled": return { label: "ANULAT", bg: "rgba(255, 95, 95, 0.1)", color: DS.colors.danger, icon: FiXCircle };
      default: return { label: "NECUNOSCUT", bg: "whiteAlpha.100", color: DS.colors.text, icon: FiMoreHorizontal };
    }
  };

  const statusStyles = getStatusStyles(booking.status);

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
        bg: "rgba(22, 24, 28, 0.85)"
      }}
    >
      <Box position="absolute" top="0" right="0" w="100px" h="100px" bg={booking.color} filter="blur(80px)" opacity={0.1} borderRadius="full" pointerEvents="none" />

      {/* HEADER RE-DESIGNAT (Mai curat, cu elemente tip etichetă/pill) */}
      <Flex justify="space-between" align="center" mb={6}>
        <Flex align="center" gap={3}>
          {/* Pill Sport */}
          <Flex align="center" gap={2} bg="whiteAlpha.50" px={3} py={1.5} borderRadius="full" border="1px solid" borderColor="whiteAlpha.100">
            <Box color={booking.color}><SportIcon size={14} /></Box>
            <Text fontSize="xs" fontWeight="800" color={DS.colors.text} letterSpacing="0.5px" textTransform="uppercase">
              {booking.sport}
            </Text>
          </Flex>
          {/* Booking ID */}
          <Text fontSize="xs" fontWeight="600" color={DS.colors.muted} display={{ base: "none", sm: "block" }}>
            ID: {booking.id}
          </Text>
        </Flex>
        
        <Badge display="flex" alignItems="center" gap={1.5} bg={statusStyles.bg} color={statusStyles.color} px={3} py={1.5} borderRadius="full" fontSize="10px" fontWeight="900" letterSpacing="0.5px">
          <Icon as={statusStyles.icon} size={12} />
          {statusStyles.label}
        </Badge>
      </Flex>

      {/* TICKET BODY */}
      <Flex direction={{ base: "column", md: "row" }} gap={6} align={{ base: "flex-start", md: "center" }}>
        <Box w={{ base: "full", md: "110px" }} h={{ base: "140px", md: "110px" }} borderRadius="2xl" overflow="hidden" position="relative" flexShrink={0}>
          <Image src={booking.image} alt={booking.venueName} objectFit="cover" w="full" h="full" transition={DS.transition} _groupHover={{ transform: "scale(1.08)" }} />
        </Box>

        <Box flex={1}>
          <Text fontSize="xl" fontWeight="900" color={DS.colors.text} letterSpacing="-0.5px" mb={1}>{booking.venueName}</Text>
          <Flex align="center" gap={2} color={DS.colors.muted}>
            <FiMapPin size={14} />
            <Text fontSize="sm" fontWeight="600">{booking.location}</Text>
          </Flex>
          {/* ID-ul pe mobil, dacă e ascuns sus */}
          <Text fontSize="xs" fontWeight="600" color={DS.colors.muted} display={{ base: "block", sm: "none" }} mt={2}>
            ID: {booking.id}
          </Text>
        </Box>

        {/* Blocuri Data / Ora */}
        <HStack spacing={3} w={{ base: "full", md: "auto" }}>
          <Box bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100" p={3} borderRadius="xl" minW="120px" flex={{ base: 1, md: "none" }}>
            <Flex align="center" gap={2} color={DS.colors.muted} mb={1}><FiCalendar size={12} /><Text fontSize="10px" fontWeight="800" letterSpacing="0.5px">DATA</Text></Flex>
            <Text fontSize="sm" fontWeight="800" color={DS.colors.text}>{booking.date}</Text>
          </Box>
          <Box bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.100" p={3} borderRadius="xl" minW="120px" flex={{ base: 1, md: "none" }}>
            <Flex align="center" gap={2} color={DS.colors.muted} mb={1}><FiClock size={12} /><Text fontSize="10px" fontWeight="800" letterSpacing="0.5px">INTERVAL</Text></Flex>
            <Text fontSize="sm" fontWeight="800" color={DS.colors.text}>{booking.time}</Text>
          </Box>
        </HStack>
      </Flex>

      <Box w="full" borderBottom="2px dashed" borderColor="whiteAlpha.100" my={6} />

      {/* TICKET FOOTER */}
      <Flex justify="space-between" align="center">
        <VStack align="start" spacing={0}>
          <Text fontSize="10px" color={DS.colors.muted} fontWeight="800" letterSpacing="1px">TOTAL</Text>
          <Text fontSize="lg" color={DS.colors.text} fontWeight="900">{booking.price}</Text>
        </VStack>
        
        {booking.status === "active" ? (
          <Button h="40px" px={6} bg="rgba(255, 95, 95, 0.1)" color={DS.colors.danger} borderRadius="xl" fontSize="xs" fontWeight="800" _hover={{ bg: "rgba(255, 95, 95, 0.2)" }} transition={DS.transition} onClick={() => onCancelClick(booking.id)}>
            Anulează Rezervarea
          </Button>
        ) : (
          <Button h="40px" px={6} bg="whiteAlpha.100" color={DS.colors.text} borderRadius="xl" fontSize="xs" fontWeight="800" leftIcon={<FiRefreshCw size={14} />} _hover={{ bg: DS.colors.brand, color: DS.colors.canvas }} transition={DS.transition}>
            Rezervă din nou
          </Button>
        )}
      </Flex>
    </Box>
  );
};


const BookingsContent = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSport, setSelectedSport] = useState("");
  
  // State pentru Modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // Logică de filtrare combinată (Tab + Sport Dropdown)
  const filteredBookings = BOOKINGS_DATA.filter(booking => {
    const matchTab = activeTab === "all" || booking.status === activeTab;
    const matchSport = selectedSport === "" || booking.sport === selectedSport;
    return matchTab && matchSport;
  });

  // Handler deschidere pop-up
  const handleOpenCancelModal = (id) => {
    setBookingToCancel(id);
    setIsCancelModalOpen(true);
  };

  // Handler confirmare anulare (aici se va face viitorul apel către backend)
  const handleConfirmCancel = () => {
    console.log(`S-a anulat rezervarea: ${bookingToCancel}`);
    setIsCancelModalOpen(false);
    setBookingToCancel(null);
    // TODO: Adaugă un toast de succes sau actualizează starea locală
  };

  return (
    <Box position="relative" minH="100vh" bg={DS.colors.canvas} overflow="hidden" mt={{ base: -6, md: -10 }} mb={{ base: "-80px", md: -10 }} mx={{ base: -4, md: -10, lg: -16 }} py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
      
      <Box position="absolute" top="-10%" left="-10%" w="50vw" h="50vw" bg="radial-gradient(circle, rgba(94, 209, 190, 0.08) 0%, transparent 60%)" filter="blur(60px)" zIndex="0" pointerEvents="none" />
      <Box position="absolute" bottom="10%" right="-10%" w="60vw" h="60vw" bg="radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 60%)" filter="blur(60px)" zIndex="0" pointerEvents="none" />

      <Box position="relative" zIndex={1} maxW="900px" mx="auto" pt={{ base: 4, md: 8 }}>
        
        <VStack align="flex-start" mb={10} spacing={2}>
          <Text fontSize={{ base: "3xl", md: "4xl" }} fontWeight="900" color={DS.colors.text} letterSpacing="-1px">
            Rezervările tale
          </Text>
          <Text fontSize="md" color={DS.colors.muted} fontWeight="500">
            Aici găsești tot istoricul activității tale și meciurile viitoare.
          </Text>
        </VStack>

        {/* BARA DE COMENZI: TABS + FILTRU SPORT */}
        <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} mb={8} gap={4}>
          <Flex overflowX="auto" gap={3} pb={{ base: 2, md: 0 }} sx={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}>
            {TABS.map((tab) => (
              <Button
                key={tab.id}
                h="44px" px={6} borderRadius="full"
                bg={activeTab === tab.id ? DS.colors.text : "transparent"}
                color={activeTab === tab.id ? DS.colors.canvas : DS.colors.muted}
                border="1px solid" borderColor={activeTab === tab.id ? DS.colors.text : "whiteAlpha.200"}
                fontWeight="800" fontSize="sm" flexShrink={0}
                onClick={() => setActiveTab(tab.id)}
                _hover={{ bg: activeTab === tab.id ? DS.colors.text : "whiteAlpha.100", color: activeTab === tab.id ? DS.colors.canvas : DS.colors.text }}
                transition={DS.transition}
              >
                {tab.label}
              </Button>
            ))}
          </Flex>

          <Box w={{ base: "full", md: "220px" }} flexShrink={0}>
            <PremiumDropdown value={selectedSport} options={SPORT_OPTIONS} onChange={setSelectedSport} placeholder="Toate sporturile" />
          </Box>
        </Flex>

        {/* LISTA REZERVĂRI */}
        {filteredBookings.length > 0 ? (
          <Grid templateColumns="1fr" gap={6}>
            {filteredBookings.map((booking) => (
              <PremiumBookingCard key={booking.id} booking={booking} onCancelClick={handleOpenCancelModal} />
            ))}
          </Grid>
        ) : (
          <Flex direction="column" align="center" justify="center" py={20} opacity={0.6}>
            <Box p={5} bg="whiteAlpha.50" borderRadius="full" mb={4}>
              <FiXCircle size={40} color={DS.colors.muted} />
            </Box>
            <Text color={DS.colors.text} fontWeight="800" fontSize="xl" mb={1}>Nicio rezervare</Text>
            <Text fontSize="sm" color={DS.colors.muted} textAlign="center">Nu am găsit meciuri conform filtrelor selectate.</Text>
          </Flex>
        )}

      </Box>

      {/* POP-UP CUSTOM (MODAL) PENTRU ANULARE */}
      {isCancelModalOpen && (
        <Box position="fixed" top={0} left={0} w="100vw" h="100vh" zIndex={9999} display="flex" alignItems="center" justifyContent="center">
          {/* Fundal întunecat și blurat */}
          <Box position="absolute" top={0} left={0} w="full" h="full" bg="blackAlpha.800" backdropFilter="blur(10px)" onClick={() => setIsCancelModalOpen(false)} />
          
          {/* Fereastra Modal */}
          <Box position="relative" bg={DS.colors.card} border={DS.border} borderRadius="3xl" p={8} maxW="400px" w="90%" textAlign="center" boxShadow="0 25px 50px -12px rgba(0,0,0,0.9)">
            <Flex justify="center" mb={4}>
              <Flex boxSize="64px" bg="rgba(255, 95, 95, 0.1)" color={DS.colors.danger} borderRadius="full" align="center" justify="center">
                <FiAlertTriangle size={32} />
              </Flex>
            </Flex>
            <Text fontSize="xl" fontWeight="900" color={DS.colors.text} mb={2}>Anulezi rezervarea?</Text>
            <Text fontSize="sm" color={DS.colors.muted} mb={8}>
              Ești sigur că vrei să anulezi meciul? Această acțiune este ireversibilă, iar politicile de rambursare se vor aplica.
            </Text>
            <HStack spacing={4}>
              <Button flex={1} variant="unstyled" color={DS.colors.text} bg="whiteAlpha.100" borderRadius="xl" h="48px" fontSize="sm" fontWeight="700" onClick={() => setIsCancelModalOpen(false)} _hover={{ bg: "whiteAlpha.200" }}>
                Înapoi
              </Button>
              <Button flex={1} bg={DS.colors.danger} color="white" borderRadius="xl" h="48px" fontSize="sm" fontWeight="800" onClick={handleConfirmCancel} _hover={{ opacity: 0.9, transform: "translateY(-2px)" }} transition={DS.transition}>
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