import React, { useState, useCallback, useEffect } from "react";
import { Box, Flex, Text, VStack, Input, Button, HStack } from "@chakra-ui/react";
import { 
  FiEdit2, FiShield, FiLock, FiAlertTriangle, FiCheckCircle, 
  FiCheck, FiX, FiStar, FiClock, FiGift, FiTrendingUp 
} from "react-icons/fi";

/**
 * @constant DESIGN_SYSTEM
 * Structura de culori premium
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
    xpTrack: "#22252A",       
  },
  border: "1px solid rgba(255, 255, 255, 0.05)",
  shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
};

/**
 * @constant BENEFITS_DATA
 * Baza de date pentru beneficii (adaptată pentru sporturi specifice)
 */
const BENEFITS_DATA = [
  { id: 1, title: "Membru de Bază", description: "Acces standard la platforma de rezervări.", requiredLevel: 1, icon: FiShield },
  { id: 2, title: "Reducere 10%", description: "Beneficiezi de 10% reducere la orice teren rezervat.", requiredLevel: 2, icon: FiTrendingUp },
  { id: 3, title: "Echipament Tenis", description: "Rachete și mingi incluse la rezervările de tenis.", requiredLevel: 4, icon: FiStar },
  { id: 4, title: "Minge Fotbal", description: "Minge profesională inclusă gratuit la terenul de fotbal.", requiredLevel: 4, icon: FiGift },
  { id: 5, title: "Anulare Flexibilă", description: "Anulezi gratuit cu până la 2 ore înainte de meci.", requiredLevel: 7, icon: FiClock },
];

/**
 * @component PremiumEditableField
 */
const PremiumEditableField = ({ label, name, value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const hasChanges = tempValue !== value;

  useEffect(() => { setTempValue(value); }, [value]);

  const handleCancel = (e) => {
    e.stopPropagation();
    setTempValue(value);
    setIsEditing(false);
  };

  const handleConfirm = (e) => {
    if (e) e.stopPropagation();
    if (hasChanges && tempValue.trim() !== "") {
      onSave(name, tempValue);
    } else {
      setTempValue(value);
    }
    setIsEditing(false);
  };

  return (
    <Box w="full" transition={DS.transition}>
      <Text fontSize="11px" fontWeight="800" color={DS.colors.muted} letterSpacing="1px" textTransform="uppercase" mb={2} px={1}>
        {label}
      </Text>
      
      <Flex
        bg={DS.colors.input}
        borderRadius="16px"
        h="56px"
        px={5}
        align="center"
        justify="space-between"
        border="1px solid"
        borderColor={isEditing ? DS.colors.brand : "transparent"}
        transition={DS.transition}
        onClick={() => !isEditing && setIsEditing(true)}
        cursor={isEditing ? "text" : "pointer"}
        _hover={{ borderColor: isEditing ? DS.colors.brand : "whiteAlpha.100" }}
      >
        <Input
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          variant="unstyled"
          color={DS.colors.text}
          fontSize="md"
          fontWeight="500"
          readOnly={!isEditing}
          _placeholder={{ color: "whiteAlpha.300" }}
          bg="transparent !important"
          _focus={{ outline: "none", boxShadow: "none", bg: "transparent" }}
        />
        
        {isEditing ? (
          <HStack spacing={2} animation="fadeIn 0.2s ease">
             <Flex as="button" align="center" justify="center" boxSize="28px" bg={DS.colors.brand} color={DS.colors.card} borderRadius="full" onClick={handleConfirm} _hover={{ opacity: 0.8 }} transition="all 0.2s">
               <FiCheck size={16} strokeWidth={3} />
             </Flex>
             <Flex as="button" align="center" justify="center" boxSize="28px" bg={DS.colors.danger} color="white" borderRadius="full" onClick={handleCancel} _hover={{ opacity: 0.8 }} transition="all 0.2s">
               <FiX size={16} strokeWidth={3} />
             </Flex>
          </HStack>
        ) : (
          <Box color={DS.colors.brand} opacity={0.8}>
             <FiEdit2 size={16} />
          </Box>
        )}
      </Flex>
    </Box>
  );
};

/**
 * @component LockedField
 */
const LockedField = ({ label, value }) => (
  <Box w="full">
    <Text fontSize="11px" fontWeight="800" color={DS.colors.muted} letterSpacing="1px" textTransform="uppercase" mb={2} px={1}>
      {label}
    </Text>
    <Flex
      bg="rgba(34, 37, 42, 0.4)"
      borderRadius="16px"
      h="56px"
      px={5}
      align="center"
      justify="space-between"
      border="1px solid"
      borderColor="whiteAlpha.50"
      cursor="not-allowed"
      title="Acest câmp nu poate fi modificat din motive de securitate."
    >
      <Text color={DS.colors.text} fontSize="md" fontWeight="500" opacity={0.6}>
        {value}
      </Text>
      <Box color={DS.colors.muted} opacity={0.4}>
        <FiLock size={16} />
      </Box>
    </Flex>
  </Box>
);

/**
 * @component BenefitCard
 */
const BenefitCard = ({ benefit, currentLevel, isActive, onToggle }) => {
  const isUnlocked = currentLevel >= benefit.requiredLevel;
  const IconComponent = benefit.icon;

  return (
    <Flex 
      bg={DS.colors.input} 
      p={5} 
      borderRadius="20px" 
      border="1px solid"
      borderColor={isActive ? DS.colors.brand : "transparent"}
      boxShadow={isActive ? "0 4px 20px rgba(94, 209, 190, 0.05)" : "none"}
      opacity={isUnlocked ? 1 : 0.4}
      align="center"
      justify="space-between"
      transition={DS.transition}
      _hover={isUnlocked ? { transform: "translateY(-2px)", borderColor: isActive ? DS.colors.brand : "whiteAlpha.100" } : {}}
      position="relative"
      overflow="hidden"
      cursor={isUnlocked ? "default" : "not-allowed"}
    >
      <Flex align="center" gap={4} flex={1}>
        <Flex boxSize="48px" borderRadius="14px" bg={isActive ? "rgba(94, 209, 190, 0.1)" : "whiteAlpha.50"} color={isActive ? DS.colors.brand : DS.colors.muted} align="center" justify="center">
          <IconComponent size={20} />
        </Flex>
        <VStack align="start" spacing={1} maxW="70%">
          <Text fontSize="md" fontWeight="800" color={isUnlocked ? DS.colors.text : DS.colors.muted}>
            {benefit.title}
          </Text>
          <Text fontSize="13px" color={DS.colors.muted} lineHeight="1.4" noOfLines={2}>
            {benefit.description}
          </Text>
        </VStack>
      </Flex>
      <Box ml={4}>
        {!isUnlocked ? (
          <VStack spacing={1} align="flex-end">
            <FiLock size={16} color={DS.colors.muted} />
            <Text fontSize="10px" fontWeight="800" color={DS.colors.muted} letterSpacing="0.5px" whiteSpace="nowrap">
              NIVEL {benefit.requiredLevel}
            </Text>
          </VStack>
        ) : isActive ? (
          <Button size="sm" variant="outline" borderColor={DS.colors.danger} color={DS.colors.danger} borderRadius="xl" fontSize="12px" fontWeight="800" px={4} onClick={() => onToggle(benefit.id)} _hover={{ bg: DS.colors.danger, color: "white" }}>
            Dezactivează
          </Button>
        ) : (
          <Button size="sm" bg="whiteAlpha.100" color={DS.colors.text} borderRadius="xl" fontSize="12px" fontWeight="800" px={4} onClick={() => onToggle(benefit.id)} _hover={{ bg: DS.colors.brand, color: DS.colors.card }}>
            Activează
          </Button>
        )}
      </Box>
    </Flex>
  );
};

const ProfileContent = () => {
  const [activeTab, setActiveTab] = useState("detalii");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeBenefits, setActiveBenefits] = useState([1, 2]);

  const [user, setUser] = useState({
    nume: "Popescu",
    prenume: "Alexandru",
    email: "popescualex20@gmail.com",
    telefon: "0712 345 678",
    initials: "DA",
    level: 4,
    xp: 850
  });

  const handleUpdate = useCallback((field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleConfirmDelete = () => {
    console.log("[API Call] Contul a fost șters.");
    setIsDeleteModalOpen(false);
  };

  const toggleBenefit = useCallback((benefitId) => {
    setActiveBenefits((prev) => 
      prev.includes(benefitId) 
        ? prev.filter(id => id !== benefitId) 
        : [...prev, benefitId]
    );
  }, []);

  return (
    <Box position="relative" minH="100vh" bg={DS.colors.canvas} overflow="hidden" mt={{ base: -6, md: -10 }} mb={{ base: "-80px", md: -10 }} mx={{ base: -4, md: -10, lg: -16 }} py={{ base: 10, md: 16 }} px={{ base: 4, md: 8 }}>
      
      {/* FUNDAL ABSTRACT */}
      <Box position="absolute" top="-10%" left="-10%" w="70vw" h="70vw" bg="radial-gradient(circle, rgba(94, 209, 190, 0.08) 0%, transparent 60%)" zIndex="0" pointerEvents="none" />
      <Box position="absolute" bottom="-10%" right="-10%" w="70vw" h="70vw" bg="radial-gradient(circle, rgba(41, 128, 185, 0.08) 0%, transparent 60%)" zIndex="0" pointerEvents="none" />

      <Box position="relative" zIndex={1}>
        <Box maxW="850px" mx="auto" bg={DS.colors.card} borderRadius={{ base: "2xl", md: "32px" }} boxShadow={DS.shadow} border={DS.border} overflow="hidden" pb={10}>
          
          {/* Header Profil */}
          <Box p={{ base: 6, md: 10 }} pt={{ base: 8, md: 12 }}>
            <VStack spacing={6} align="center">
              <Box position="relative">
                <Flex boxSize="116px" bg={DS.colors.brand} color={DS.colors.card} borderRadius="full" align="center" justify="center" fontSize="4xl" fontWeight="900" boxShadow={`0 10px 30px rgba(94, 209, 190, 0.2)`}>
                  {user.initials}
                </Flex>
                <Box position="absolute" bottom="1" right="1" bg={DS.colors.card} borderRadius="full" p={1}>
                  <FiCheckCircle size={24} color={DS.colors.brand} fill={DS.colors.card} />
                </Box>
              </Box>

              <VStack spacing={2}>
                <Text fontSize="28px" fontWeight="800" letterSpacing="-0.5px" color={DS.colors.text}>
                  {user.nume} {user.prenume}
                </Text>
                <Box w="280px" mt={2}>
                  <Flex justify="space-between" fontSize="11px" fontWeight="800" mb={2} color={DS.colors.muted}>
                    <Text letterSpacing="1px">EXPERIENCE</Text>
                    <Text color={DS.colors.brand}>XP {user.xp} <Box as="span" color={DS.colors.brand}>●</Box></Text>
                  </Flex>
                  <Box w="full" h="6px" bg={DS.colors.xpTrack} borderRadius="full" overflow="hidden">
                    <Box w="85%" h="full" bg={DS.colors.brand} borderRadius="full" transition="width 0.5s ease" />
                  </Box>
                  <Text fontSize="9px" color={DS.colors.brand} mt={3} textAlign="center" fontWeight="800" letterSpacing="0.5px">
                    ANTRENAMENTUL E TOTUL!
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </Box>

          {/* Tab-uri tip Capsulă */}
          <Flex justify="center" mb={10}>
            <Flex bg={DS.colors.input} borderRadius="full" p={1} border={DS.border}>
              <Button onClick={() => setActiveTab("detalii")} bg={activeTab === "detalii" ? DS.colors.brand : "transparent"} color={activeTab === "detalii" ? DS.colors.card : DS.colors.text} borderRadius="full" px={8} h="40px" fontSize="sm" fontWeight="800" transition={DS.transition} _hover={{ bg: activeTab === "detalii" ? DS.colors.brand : "whiteAlpha.100" }}>
                Detalii cont
              </Button>
              <Button onClick={() => setActiveTab("beneficii")} bg={activeTab === "beneficii" ? DS.colors.brand : "transparent"} color={activeTab === "beneficii" ? DS.colors.card : DS.colors.text} borderRadius="full" px={8} h="40px" fontSize="sm" fontWeight="800" transition={DS.transition} _hover={{ bg: activeTab === "beneficii" ? DS.colors.brand : "whiteAlpha.100" }}>
                Beneficii
              </Button>
            </Flex>
          </Flex>

          {/* Conținut Tab-uri */}
          <Box px={{ base: 6, md: 12 }}>
            {activeTab === "detalii" ? (
              <VStack spacing={6} align="stretch" animation="fadeIn 0.3s ease">
                <Text fontSize="12px" fontWeight="800" color={DS.colors.text} letterSpacing="1px" mb={2}>DATE PERSONALE</Text>
                <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
                  <PremiumEditableField label="Nume" name="nume" value={user.nume} onSave={handleUpdate} />
                  <PremiumEditableField label="Prenume" name="prenume" value={user.prenume} onSave={handleUpdate} />
                  <LockedField label="Email" value={user.email} />
                  <PremiumEditableField label="Telefon" name="telefon" value={user.telefon} onSave={handleUpdate} />
                </Box>
                
                {/* Butonul de ștergere exact ca în imaginea de referință (fără text ajutător, outline curat) */}
                <Box pt={8}>
                  <Flex justify={{ base: "center", md: "flex-end" }}>
                    <Button
                      bg="transparent"
                      color={DS.colors.danger}
                      border="1px solid"
                      borderColor={DS.colors.danger}
                      h="48px"
                      px={10}
                      borderRadius="xl" 
                      fontWeight="800"
                      fontSize="sm"
                      onClick={() => setIsDeleteModalOpen(true)}
                      _hover={{ bg: "rgba(255, 95, 95, 0.08)" }}
                      transition="all 0.2s"
                    >
                      LOG OUT
                    </Button>
                  </Flex>
                </Box>
              </VStack>
            ) : (
              /* TAB-UL BENEFICII */
              <VStack spacing={6} align="stretch" animation="fadeIn 0.3s ease">
                <Flex justify="space-between" align="flex-end" mb={2}>
                  <Text fontSize="12px" fontWeight="800" color={DS.colors.text} letterSpacing="1px">GESTIONEAZĂ BENEFICIILE</Text>
                  <Text fontSize="11px" fontWeight="800" color={DS.colors.brand}>NIVEL CURENT: {user.level}</Text>
                </Flex>
                
                <VStack spacing={4} align="stretch">
                  {BENEFITS_DATA.map((benefit) => (
                    <BenefitCard 
                      key={benefit.id} 
                      benefit={benefit} 
                      currentLevel={user.level} 
                      isActive={activeBenefits.includes(benefit.id)}
                      onToggle={toggleBenefit}
                    />
                  ))}
                </VStack>

                <Flex mt={6} p={5} bg="rgba(94, 209, 190, 0.05)" borderRadius="20px" border="1px dashed" borderColor={DS.colors.brand} align="center" gap={4}>
                  <FiTrendingUp size={24} color={DS.colors.brand} />
                  <Box>
                    <Text fontSize="sm" fontWeight="800" color={DS.colors.text}>Joacă și crește în nivel!</Text>
                    <Text fontSize="xs" color={DS.colors.muted} mt={1}>Fiecare rezervare finalizată îți aduce XP. Următorul beneficiu se deblochează la Nivelul 7.</Text>
                  </Box>
                </Flex>
              </VStack>
            )}
          </Box>

        </Box>
      </Box>

      {/* POP-UP (MODAL) ȘTERGERE CONT */}
      {isDeleteModalOpen && (
        <Flex position="fixed" top="0" left="0" w="100vw" h="100vh" bg="blackAlpha.800" backdropFilter="blur(5px)" zIndex="9999" justify="center" align="center" px={4}>
          <Box bg={DS.colors.card} p={8} borderRadius="2xl" maxW="400px" w="full" border={DS.border} boxShadow="0 25px 50px -12px rgba(0,0,0,0.8)" textAlign="center" animation="fadeIn 0.2s ease-out">
            <Flex justify="center" mb={5} color={DS.colors.danger}>
              <FiAlertTriangle size={48} />
            </Flex>
            <Text fontSize="xl" fontWeight="800" color={DS.colors.text} mb={3}>Ești absolut sigur?</Text>
            <Text fontSize="sm" color={DS.colors.muted} mb={8} lineHeight="tall">
              Această acțiune este permanentă și ireversibilă. Toate datele tale vor fi șterse definitiv.
            </Text>
            <HStack spacing={4} justify="center">
              <Button flex={1} variant="unstyled" color={DS.colors.text} bg={DS.colors.input} h="50px" borderRadius="xl" fontWeight="700" onClick={() => setIsDeleteModalOpen(false)} _hover={{ bg: "whiteAlpha.200" }}>
                Anulează
              </Button>
              <Button flex={1} bg={DS.colors.danger} color="white" h="50px" borderRadius="xl" fontWeight="700" onClick={handleConfirmDelete} _hover={{ filter: "brightness(1.1)" }}>
                Da, șterge
              </Button>
            </HStack>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default ProfileContent;