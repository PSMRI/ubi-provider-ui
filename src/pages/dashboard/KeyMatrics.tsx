// src/components/KeyMetrics.tsx
import React from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Divider,
  Select,
} from "@chakra-ui/react";
import StatBox from "../../components/common/widget/StatBox"; // Reusing StatBox
import TD2 from "../../components/common/typography/TD2";
import {
  applicantData,
  popularBenefits,
} from "../../components/common/widget/StatData";
import TT1 from "../../components/common/typography/TT1";

const KeyMetrics: React.FC = () => {
  return (
    <VStack align="stretch" spacing="40px" width="100%">
      <Box
        width="1100px"
        height="52px"
        gap="60px"
        paddingTop={"60px"}
        paddingLeft={"170px"}
      >
        <HStack justify="space-between" align="center" width="100%">
          {/* Key Metrics Heading */}
          <TD2 color="#06164B">Key Metrics</TD2>

          {/* This Month Dropdown */}
          <Select
            placeholder="This Month"
            width="200px"
            borderColor="gray.300"
            bg="white"
            _hover={{ borderColor: "gray.400" }}
            _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
          ></Select>
        </HStack>
      </Box>

      <Box
        width="1100px"
        height="532"
        paddingTop="60px"
        paddingLeft="170px"
        gap="60px"
      >
        <HStack spacing="60px" justify="flex-start" align="start">
          <Box width="340px" height="auto" gap="20px">
            <VStack spacing={4} align="start">
              <TT1 color={"#2F3036"}>Applicant Overview</TT1>
              <VStack spacing={4}>
                {applicantData.map((item) => (
                  <StatBox
                    key={item.id}
                    number={item.number}
                    label={item.label}
                  />
                ))}
              </VStack>
            </VStack>
          </Box>
          <Box width="340px" height="auto" gap="20px">
            <VStack spacing={4} align={"start"}>
              <TT1 color={"#2F3036"}>Financial Overview</TT1>
              <VStack spacing={4}>
                {applicantData.map((item) => (
                  <StatBox
                    key={item.id}
                    number={item.number}
                    label={item.label}
                  />
                ))}
              </VStack>
            </VStack>
          </Box>
        </HStack>
      </Box>
    </VStack>
  );
};

export default KeyMetrics;
