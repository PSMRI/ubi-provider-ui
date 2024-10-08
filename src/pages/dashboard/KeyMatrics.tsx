import React from "react";
import {
  Box,
  Stack,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Center,
} from "@chakra-ui/react";
import TD1 from "../../components/common/typography/TD1";
import { useTranslation } from "react-i18next";
import TT1 from "../../components/common/typography/TT1";
import TT3 from "../../components/common/typography/TT3";
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
  const { t } = useTranslation();
  return (
    <Stack p={8} maxW="1200px" mx="auto">
      {/* Key Metrics Heading */}
      <VStack spacing={4} marginBottom={"20px"} align="start" w="full">
        <TD1 color="#2F3036">{t("DASHBOARD_KEY_MATRICS")}</TD1>
        <TT1 color="#2F3036">{t("DASHBOARD_APPLICANT_OVERVIEW")}</TT1>
      </VStack>

      {/* Stat Boxes for Applicant Overview */}
      <HStack spacing={8} w="full" justify="space-between">
        <StatBox number={54321} label="Total Applicants" />
        <StatBox number={12345} label="New Applicants" />
        <StatBox number={67890} label="Accepted Applicants" />
        <StatBox number={98765} label="Rejected Applicants" />
      </HStack>

      {/* Financial Overview Heading */}
      <VStack spacing={4} align="start" w="full" marginBottom={"20px"}>
        <TT1 color="#2F3036">{t("DASHBOARD_FINANCIAL_OVERVIEW")}</TT1>
      </VStack>

      {/* Stat Boxes for Financial Overview */}
      <HStack spacing={8} w="full" justify="space-between">
        <StatBox number={50000} label="Total Budget" isRupee={true} />
        <StatBox number={30000} label="Spent Budget" isRupee={true} />
        <StatBox number={15000} label="Remaining Budget" isRupee={true} />
        <StatBox number={5000} label="Pending Payments" isRupee={true} />
      </HStack>
      <Center>
        <Button
          colorScheme={"blue"}
          variant={"solid"}
          w={"494px"}
          marginTop={"20px"}
          borderRadius={"100px"}
        >
          <TT3>{t("DASHBOARD_KEY_MATRICS_BUTTON")}</TT3>
        </Button>
      </Center>
    </Stack>
  );
};

export default KeyMatrics;
