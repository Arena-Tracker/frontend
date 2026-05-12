import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  VStack,
  Icon,
  Badge,
} from "@chakra-ui/react";
import { FiX, FiPlus, FiTrash2, FiSave } from "react-icons/fi";
import { colors } from "../pages/colors";

const EditTerenModal = ({ isOpen, onClose, onSave, terenData }) => {
  const [formData, setFormData] = useState({
    id: null,
    numeTeren: "",
    numarLocuri: "",
    pretPeOra: "",
    servicii: [],
    sport: "Fotbal",
  });

  useEffect(() => {
    if (isOpen && terenData) {
      setFormData({
        id: terenData.id,
        numeTeren: terenData.numeTeren || "",
        numarLocuri: terenData.numarLocuri || "",
        pretPeOra: terenData.pretPeOra || "",
        sport: terenData.sport || "Necunoscut",
        servicii: (terenData.servicii || []).map((srv) => ({
          ...srv,
          uid: srv.id || Date.now() + Math.random(),
        })),
      });
    }
  }, [isOpen, terenData]);

  if (!isOpen || !terenData) return null;

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

  const handleSubmit = () => onSave(formData);

  // STILURI PENTRU INPUTURI (Efect de adâncime pentru vizibilitate maximă)
  const invertedInputStyles = {
    bg: "rgba(0, 0, 0, 0.25)", // Mai închis pentru a părea "săpat" în ecran
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
        bg={colors.bgMain}
        w="90%"
        maxW="2xl"
        borderRadius="2xl"
        border={`1px solid ${colors.bgCard}`}
        boxShadow="0 25px 50px -12px rgba(0, 0, 0, 0.7)"
        overflow="hidden"
        zIndex={1001}
        animation="fadeIn 0.2s"
      >
        {/* Header Gradient Top-Bottom */}
        <Flex
          justify="space-between"
          align="center"
          p={6}
          borderBottom={`1px solid rgba(94, 209, 190, 0.1)`}
          bg="linear-gradient(180deg, rgba(94, 209, 190, 0.08) 0%, rgba(22, 24, 28, 0) 100%)"
        >
          <Box>
            <Text
              color="gray.400"
              fontSize="sm"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="widest"
            >
              Modificare date
            </Text>
            <Text color={colors.textMain} fontWeight="800" fontSize="2xl">
              {terenData.numeTeren}
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
              background: "rgba(94, 209, 190, 0.2)",
              borderRadius: "10px",
            },
          }}
        >
          <VStack spacing={6} align="stretch">
            <Box>
              <Flex justify="space-between" align="center" mb={4}>
                <Text color={colors.textMain} fontSize="md" fontWeight="700">
                  Detalii Principale
                </Text>
                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg="rgba(94, 209, 190, 0.1)"
                  color={colors.accent}
                >
                  Sport: {formData.sport} (Fix)
                </Badge>
              </Flex>

              <Box mb={4}>
                <Text color="gray.400" fontSize="xs" fontWeight="600" mb={2}>
                  NUME TEREN
                </Text>
                <Input
                  placeholder="Nume teren"
                  {...invertedInputStyles}
                  value={formData.numeTeren}
                  onChange={(e) =>
                    setFormData({ ...formData, numeTeren: e.target.value })
                  }
                />
              </Box>

              <Flex gap={4}>
                <Box flex={1}>
                  <Text color="gray.400" fontSize="xs" fontWeight="600" mb={2}>
                    CAPACITATE (LOCURI)
                  </Text>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="12"
                    {...invertedInputStyles}
                    value={formData.numarLocuri}
                    onChange={(e) =>
                      handleNumberInput("numarLocuri", e.target.value)
                    }
                  />
                </Box>
                <Box flex={1}>
                  <Text color="gray.400" fontSize="xs" fontWeight="600" mb={2}>
                    PREȚ PE ORĂ (RON)
                  </Text>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="120"
                    {...invertedInputStyles}
                    value={formData.pretPeOra}
                    onChange={(e) =>
                      handleNumberInput("pretPeOra", e.target.value)
                    }
                  />
                </Box>
              </Flex>
            </Box>

            <Box w="100%" h="1px" bg="whiteAlpha.50" my={2} />

            <Box>
              <Flex justify="space-between" align="center" mb={4}>
                <Text color={colors.textMain} fontSize="md" fontWeight="700">
                  Servicii Extra
                </Text>
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="rgba(94, 209, 190, 0.3)"
                  color={colors.accent}
                  leftIcon={<FiPlus />}
                  _hover={{
                    bg: "rgba(94, 209, 190, 0.1)",
                    borderColor: colors.accent,
                  }}
                  onClick={addService}
                >
                  Adaugă
                </Button>
              </Flex>

              {formData.servicii.length === 0 ? (
                <Flex
                  align="center"
                  justify="center"
                  h="80px"
                  borderRadius="xl"
                  border="1px dashed rgba(255,255,255,0.1)"
                >
                  <Text fontSize="sm" color="gray.500">
                    Niciun serviciu extra.
                  </Text>
                </Flex>
              ) : (
                <VStack spacing={3} align="stretch">
                  {formData.servicii.map((serviciu) => (
                    // BUG FIX: Am modificat fundalul randului si am facut inputurile sa aiba margini clare
                    <Flex
                      key={serviciu.uid}
                      gap={3}
                      align="flex-end"
                      bg="rgba(255, 255, 255, 0.03)"
                      p={3}
                      borderRadius="xl"
                      border="1px solid rgba(255,255,255,0.05)"
                    >
                      <Box flex={2}>
                        <Text
                          color="gray.400"
                          fontSize="10px"
                          fontWeight="700"
                          letterSpacing="wider"
                          mb={1}
                        >
                          SERVICIU
                        </Text>
                        <Input
                          placeholder="Minge"
                          {...invertedInputStyles}
                          h="40px"
                          fontSize="sm"
                          value={serviciu.nume}
                          onChange={(e) =>
                            updateService(serviciu.uid, "nume", e.target.value)
                          }
                        />
                      </Box>
                      <Box flex={1}>
                        <Text
                          color="gray.400"
                          fontSize="10px"
                          fontWeight="700"
                          letterSpacing="wider"
                          mb={1}
                        >
                          PREȚ (RON)
                        </Text>
                        <Input
                          type="text"
                          inputMode="decimal"
                          placeholder="0"
                          {...invertedInputStyles}
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
                      </Box>
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
          bg="rgba(0,0,0,0.3)"
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
            variant="outline"
            borderColor={colors.accent}
            color={colors.accent}
            leftIcon={<FiSave />}
            _hover={{ bg: colors.accent, color: "#16181C" }}
            onClick={handleSubmit}
          >
            Salvează Modificările
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default EditTerenModal;
