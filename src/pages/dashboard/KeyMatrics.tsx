import React from "react";
import { Box, VStack, HStack, Heading, Text } from "@chakra-ui/react";

// Define the props for StatBox
interface StatBoxProps {
  number: number;
  label: string;
  isRupee?: boolean;
}

// Stateless functional component for the StatBox
const StatBox: React.FC<StatBoxProps> = ({ number, label, isRupee }) => (
  <VStack
    border="1px solid"
    borderColor="gray.200"
    p={4}
    borderRadius="md"
    w="full"
    align="center"
  >
    <Heading size="lg">{isRupee ? `₹${number}` : number}</Heading>
    <Text>{label}</Text>
  </VStack>
);

const KeyMatrics: React.FC = () => {
  return (
    <Box p={8} maxW="1200px" mx="auto">
      {/* Key Metrics Heading */}
      <VStack spacing={4} align="start" w="full">
        <Heading size="lg">Key Metrics</Heading>
        <Text fontSize="xl" color="gray.500">
          Applicant Overview
        </Text>
      </VStack>

      {/* Stat Boxes for Applicant Overview */}
      <HStack spacing={8} mt={4} w="full" justify="space-between">
        <StatBox number={54321} label="Total Applicants" />
        <StatBox number={12345} label="New Applicants" />
        <StatBox number={67890} label="Accepted Applicants" />
        <StatBox number={98765} label="Rejected Applicants" />
      </HStack>

      {/* Financial Overview Heading */}
      <VStack spacing={4} align="start" w="full" mt={10}>
        <Text fontSize="xl" color="gray.500">
          Financial Overview
        </Text>
      </VStack>

      {/* Stat Boxes for Financial Overview */}
      <HStack spacing={8} mt={4} w="full" justify="space-between">
        <StatBox number={50000} label="Total Budget" isRupee={true} />
        <StatBox number={30000} label="Spent Budget" isRupee={true} />
        <StatBox number={15000} label="Remaining Budget" isRupee={true} />
        <StatBox number={5000} label="Pending Payments" isRupee={true} />
      </HStack>
    </Box>
  );
};

export default KeyMatrics;
