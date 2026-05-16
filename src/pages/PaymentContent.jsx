import React, { useState, useEffect } from "react";
import { 
  Box, VStack, Heading, Text, Flex, 
  SimpleGrid, Button, Spinner, Icon 
} from "@chakra-ui/react";
// Importam noul toaster
import { toaster } from "../components/ui/toaster";

import { colors } from "./colors";
import { MdReceipt, MdCalendarToday, MdDownload, MdEventSeat } from "react-icons/md";
import { API_URLS } from "../config/api.config";

const PaymentsContent = ({ user }) => {
  const [facturi, setFacturi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const accentColor = colors?.accent || "#5ED1BE";
  const bgCard = colors?.bgCard || "#16181C";

  const fetchFacturi = async () => {
    const userId = user?.id || 1; 
    
    try {
      setLoading(true);
      const response = await fetch(`${API_URLS.PAYMENTS}/payment/user/${userId}`);
      if (!response.ok) throw new Error("Eroare la preluarea facturilor");
      
      const data = await response.json();
      setFacturi(data);
    } catch (error) {
      toaster.create({
        title: "Eroare conexiune",
        description: "Nu am putut încărca facturile.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacturi();
  }, [user]);

  const handleDownloadPdf = async (idFactura) => {
    try {
      setDownloadingId(idFactura);
      const response = await fetch(`${API_URLS.PAYMENTS}/payment/${idFactura}/pdf`);
      
      if (!response.ok) throw new Error("Nu am putut genera PDF-ul");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Factura_${idFactura}.pdf`; 
      document.body.appendChild(link);
      link.click(); 
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toaster.create({
        title: "Descărcare reușită",
        type: "success",
        duration: 2000,
      });
    } catch (error) {
      toaster.create({
        title: "Eroare la descărcare",
        description: "PDF-ul nu a putut fi accesat.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <Flex w="100%" h="50vh" justify="center" align="center">
        <Spinner size="xl" color={accentColor} thickness="4px" />
      </Flex>
    );
  }

  return (
    <Box p={6} w="100%" maxW="1200px" mx="auto">
      <Heading size="xl" color="white" mb={8} letterSpacing="tight">
        Istoric Facturi
      </Heading>

      {facturi.length === 0 ? (
        <Box p={10} bg={bgCard} borderRadius="2xl" textAlign="center" border="1px dashed whiteAlpha.300">
          <Text color="gray.400" fontSize="lg">Nu ai nicio factură înregistrată momentan.</Text>
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {facturi.map((factura) => (
            <Box 
              key={factura.id} p={6} bg={bgCard} borderRadius="2xl" 
              border={`1px solid ${accentColor}33`} boxShadow="0 10px 30px rgba(0,0,0,0.3)"
              transition="all 0.3s" _hover={{ transform: "translateY(-5px)", borderColor: accentColor }}
            >
              <VStack align="stretch" spacing={4}>
                <Flex justify="space-between" align="center">
                  <Flex align="center">
                    <Icon as={MdReceipt} color={accentColor} boxSize={5} mr={2} />
                    <Heading size="md" color="white">Factura #{factura.id.substring(0, 8)}...</Heading>
                  </Flex>
                  <Text color={accentColor} fontWeight="bold" fontSize="lg">
                    {factura.totalPlata} RON
                  </Text>
                </Flex>

                <Flex direction="column" gap={2}>
                  <Flex align="center" color="gray.400">
                    <Icon as={MdCalendarToday} mr={2} />
                    <Text>Emisă la: {factura.dataEmitere}</Text>
                  </Flex>
                  <Flex align="center" color="gray.400">
                    <Icon as={MdEventSeat} mr={2} />
                    <Text>Pentru rezervarea ID: {factura.idRezervare}</Text>
                  </Flex>
                </Flex>

                <Flex justify="flex-end" mt={2} pt={4} borderTop="1px solid" borderColor="whiteAlpha.100">
                  <Button 
                    size="sm" bg="whiteAlpha.100" color="white" _hover={{ bg: accentColor, color: "black" }}
                    onClick={() => handleDownloadPdf(factura.id)}
                    isLoading={downloadingId === factura.id}
                    loadingText="Descărcare..."
                  >
                    <Flex align="center">
                      <Icon as={MdDownload} mr={2} />
                      <Text>Descarcă PDF</Text>
                    </Flex>
                  </Button>
                </Flex>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default PaymentsContent;