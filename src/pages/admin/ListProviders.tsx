import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Text,
  useToast,
  Spinner,
  Center,
  VStack,
} from "@chakra-ui/react";
import Layout from "../../components/layout/Layout";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getRoles } from "../../services/auth";

interface Provider {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

const ListProviders: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!isSuperAdmin) {
      navigate("/");
    }
  }, [isSuperAdmin, navigate]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await getRoles();
        setProviders(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch providers. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [toast]);

  return (
    <Layout showMenu={true} showSearchBar={false} showLanguage={false}>
      <Box p={8} bg="gray.50" minH="100vh">
        <VStack spacing={8} align="stretch" maxW="1200px" mx="auto">
          <Box>
            <Heading size="lg" color="gray.700" mb={2}>
              Provider Management
            </Heading>
            <Text color="gray.600">
              View and manage all providers in the system.
            </Text>
          </Box>

          <Box bg="white" shadow="md" borderRadius="lg" p={8}>
            {isLoading ? (
              <Center py={8}>
                <Spinner size="xl" color="blue.500" />
              </Center>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Created At</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {providers.map((provider) => (
                    <Tr key={provider.id}>
                      <Td>{provider.name}</Td>
                      <Td>{provider.description}</Td>
                      <Td>
                        {new Date(provider.createdAt).toLocaleDateString()}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>
        </VStack>
      </Box>
    </Layout>
  );
};

export default ListProviders; 