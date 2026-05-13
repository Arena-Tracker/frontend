import React, { useState } from "react";
import { Box, Flex, Text, Button, Input, VStack, Icon } from "@chakra-ui/react";
import { FiX, FiPlus, FiTrash2, FiChevronDown, FiCheck } from "react-icons/fi";
import { colors } from "../pages/colors";

const SPORT_OPTIONS = [
  { id: 1, nume: "Fotbal" },
  { id: 2, nume: "Tenis" },
  { id: 3, nume: "Baschet" },
  { id: 4, nume: "Volei" },
];

const DEFAULT_FORM_STATE = {
  id: null,
  numeTeren: "",
  numarLocuri: "",
  pretPeOra: "",
  idBazaSportiva: 1,
  idSport: 1,
  servicii: [],
};

// --- STILURI GLOBALE PENTRU INPUTURI ---
const inputStyles = {
  bg: "rgba(0, 0, 0, 0.25)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  color: colors.textMain,
  h: "48px",
  borderRadius: "xl",
  _focus: {
    borderColor: colors.accent,
    bg: "rgba(0, 0, 0, 0.4)",
    outline: "none",
    boxShadow: `0 0 0 1px ${colors.accent}`,
  },
  _focusVisible: { outline: "none" },
  _placeholder: { color: "gray.600" },
};

// --- COMPONENTE CUSTOM MUTATE ÎN AFARA RENDER-ULUI ---
const CustomFormField = ({ label, isRequired, children, flex }) => (
  <Box w="100%" flex={flex}>
    <Text
      color="gray.400"
      fontSize="10px"
      fontWeight="800"
      letterSpacing="wider"
      mb={2}
      textTransform="uppercase"
    >
      {label}{" "}
      {isRequired && (
        <Text as="span" color="red.400">
          *
        </Text>
      )}
    </Text>
    {children}
  </Box>
);

const CustomSelect = ({ value, onChange }) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectedOption = SPORT_OPTIONS.find((o) => o.id === value);

  return (
    <Box position="relative" w="100%">
      <Flex
        {...inputStyles}
        px={4}
        align="center"
        justify="space-between"
        cursor="pointer"
        border={
          isSelectOpen ? `1px solid ${colors.accent}` : inputStyles.border
        }
        boxShadow={isSelectOpen ? `0 0 0 1px ${colors.accent}` : "none"}
        onClick={() => setIsSelectOpen(!isSelectOpen)}
        transition="all 0.2s"
      >
        <Text
          color={selectedOption ? colors.textMain : "gray.600"}
          fontSize="md"
          fontWeight="500"
        >
          {selectedOption ? selectedOption.nume : "Selectează sportul"}
        </Text>
        <Icon
          as={FiChevronDown}
          color="gray.400"
          transform={isSelectOpen ? "rotate(180deg)" : "none"}
          transition="transform 0.3s"
        />
      </Flex>

      {isSelectOpen && (
        <Box
          position="absolute"
          top="calc(100% + 8px)"
          left={0}
          w="100%"
          bg={colors.bgMain}
          borderRadius="xl"
          border={`1px solid rgba(255,255,255,0.05)`}
          boxShadow="2xl"
          zIndex={10}
          p={2}
          animation="fadeIn 0.2s"
        >
          {SPORT_OPTIONS.map((opt) => (
            <Flex
              key={opt.id}
              p={3}
              align="center"
              cursor="pointer"
              borderRadius="lg"
              color={value === opt.id ? colors.accent : colors.textMain}
              bg={value === opt.id ? "rgba(94, 209, 190, 0.1)" : "transparent"}
              _hover={{ bg: "rgba(255,255,255,0.05)" }}
              onClick={() => {
                onChange(opt.id);
                setIsSelectOpen(false);
              }}
            >
              <Text fontWeight="600">{opt.nume}</Text>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
};

// --- COMPONENTA PRINCIPALĂ ---
const AddTerenModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  // FIX PENTRU A EVITA useEffect (Cascading Renders)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setFormData(initialData || DEFAULT_FORM_STATE);
    }
  }

  if (!isOpen) return null;

  const addService = () =>
    setFormData({
      ...formData,
      servicii: [
        ...formData.servicii,
        { uid: Date.now() + Math.random(), nume: "", pret: "" },
      ],
    });
  const updateService = (uid, field, val) =>
    setFormData({
      ...formData,
      servicii: formData.servicii.map((srv) =>
        srv.uid === uid ? { ...srv, [field]: val } : srv,
      ),
    });
  const removeService = (uid) =>
    setFormData({
      ...formData,
      servicii: formData.servicii.filter((srv) => srv.uid !== uid),
    });

  const handleNumberInput = (field, value) => {
    const cleanValue = value.replace(/[^0-9.]/g, "");
    setFormData({ ...formData, [field]: cleanValue });
  };

  const handleSubmit = () => onSave(formData, false);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        bg="blackAlpha.800"
        backdropFilter="blur(6px)"
        onClick={onClose}
        cursor="pointer"
      />

      <Box
        position="relative"
        bg={colors.bgCard}
        w="90%"
        maxW="2xl"
        borderRadius="2xl"
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.7)"
        overflow="hidden"
        zIndex={1001}
        animation="fadeIn 0.2s"
      >
        <Flex
          justify="space-between"
          align="center"
          p={6}
          borderBottom={`1px solid rgba(255,255,255,0.05)`}
          bg="linear-gradient(90deg, rgba(94, 209, 190, 0.12) 0%, rgba(34, 37, 42, 0) 100%)"
        >
          <Box>
            <Text
              color={colors.accent}
              fontSize="xs"
              fontWeight="800"
              textTransform="uppercase"
              letterSpacing="widest"
              mb={1}
            >
              Bază de date
            </Text>
            <Text color={colors.textMain} fontWeight="800" fontSize="2xl">
              Creează Teren Nou
            </Text>
          </Box>
          <Flex
            as="button"
            align="center"
            justify="center"
            h="32px"
            w="32px"
            borderRadius="md"
            color="gray.400"
            _hover={{ bg: "whiteAlpha.200", color: "white" }}
            onClick={onClose}
          >
            <Icon as={FiX} boxSize={5} />
          </Flex>
        </Flex>

        <Box
          p={6}
          maxH="65vh"
          overflowY="auto"
          css={{
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
            },
          }}
        >
          <VStack spacing={6} align="stretch">
            <Box>
              <Text
                color={colors.textMain}
                fontSize="md"
                fontWeight="700"
                mb={4}
              >
                Detalii Principale
              </Text>
              <CustomFormField label="Nume Teren" isRequired>
                <Input
                  placeholder="Ex: Teren Fotbal VIP"
                  {...inputStyles}
                  value={formData.numeTeren}
                  onChange={(e) =>
                    setFormData({ ...formData, numeTeren: e.target.value })
                  }
                />
              </CustomFormField>
              <Flex gap={4} mt={4}>
                <CustomFormField label="Tip Sport" isRequired flex={1}>
                  <CustomSelect
                    value={formData.idSport}
                    onChange={(newVal) =>
                      setFormData({ ...formData, idSport: newVal })
                    }
                  />
                </CustomFormField>
                <CustomFormField
                  label="Capacitate (Locuri)"
                  isRequired
                  flex={1}
                >
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Ex: 12"
                    {...inputStyles}
                    value={formData.numarLocuri}
                    onChange={(e) =>
                      handleNumberInput("numarLocuri", e.target.value)
                    }
                  />
                </CustomFormField>
              </Flex>
              <Box mt={4}>
                <CustomFormField label="Preț pe oră (RON)" isRequired>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: 120"
                    {...inputStyles}
                    value={formData.pretPeOra}
                    onChange={(e) =>
                      handleNumberInput("pretPeOra", e.target.value)
                    }
                  />
                </CustomFormField>
              </Box>
            </Box>

            <Box w="100%" h="1px" bg="whiteAlpha.50" my={2} />

            <Box>
              <Flex justify="space-between" align="center" mb={4}>
                <Text color={colors.textMain} fontSize="md" fontWeight="700">
                  Servicii Extra
                </Text>
                <Button
                  size="sm"
                  bg="rgba(94, 209, 190, 0.1)"
                  color={colors.accent}
                  leftIcon={<FiPlus />}
                  _hover={{ bg: "rgba(94, 209, 190, 0.2)" }}
                  onClick={addService}
                >
                  Adaugă Serviciu
                </Button>
              </Flex>

              {formData.servicii.length === 0 ? (
                <Flex
                  align="center"
                  justify="center"
                  h="80px"
                  borderRadius="xl"
                  bg="rgba(0,0,0,0.15)"
                  border="1px dashed rgba(255,255,255,0.1)"
                >
                  <Text fontSize="sm" color="gray.500">
                    Nu ai adăugat niciun serviciu extra.
                  </Text>
                </Flex>
              ) : (
                <VStack spacing={3} align="stretch">
                  {formData.servicii.map((serviciu) => (
                    <Flex
                      key={serviciu.uid}
                      gap={3}
                      align="flex-end"
                      bg="rgba(255,255,255,0.03)"
                      p={3}
                      borderRadius="xl"
                      border="1px solid rgba(255,255,255,0.05)"
                    >
                      <CustomFormField label="Nume Serviciu" flex={2}>
                        <Input
                          placeholder="Ex: Minge"
                          {...inputStyles}
                          h="40px"
                          fontSize="sm"
                          value={serviciu.nume}
                          onChange={(e) =>
                            updateService(serviciu.uid, "nume", e.target.value)
                          }
                        />
                      </CustomFormField>
                      <CustomFormField label="Preț (RON)" flex={1}>
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="0"
                          {...inputStyles}
                          h="40px"
                          fontSize="sm"
                          value={serviciu.pret}
                          onChange={(e) =>
                            updateService(
                              serviciu.uid,
                              "pret",
                              e.target.value.replace(/[^0-9.]/g, ""),
                            )
                          }
                        />
                      </CustomFormField>
                      <Flex
                        as="button"
                        type="button"
                        align="center"
                        justify="center"
                        h="40px"
                        w="40px"
                        bg="rgba(239, 68, 68, 0.1)"
                        color="red.500"
                        borderRadius="lg"
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ bg: "red.500", color: "white" }}
                        onClick={() => removeService(serviciu.uid)}
                      >
                        <Icon as={FiTrash2} />
                      </Flex>
                    </Flex>
                  ))}
                </VStack>
              )}
            </Box>
          </VStack>
        </Box>

        <Flex
          justify="flex-end"
          p={5}
          borderTop={`1px solid rgba(255,255,255,0.05)`}
          gap={3}
          bg="rgba(0,0,0,0.1)"
        >
          <Button
            variant="ghost"
            color="gray.400"
            _hover={{ bg: "whiteAlpha.100" }}
            onClick={onClose}
          >
            Anulează
          </Button>
          <Button
            bg={colors.accent}
            color="#16181C"
            leftIcon={<FiCheck />}
            _hover={{
              bg: "#4BC0AD",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(94, 209, 190, 0.3)",
            }}
            transition="all 0.2s"
            onClick={handleSubmit}
          >
            Salvează Terenul
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default AddTerenModal;
