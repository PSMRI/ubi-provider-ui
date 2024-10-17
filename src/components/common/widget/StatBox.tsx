// src/components/StatBox.tsx
import { Box, Text, VStack } from "@chakra-ui/react";
import React from "react";

interface StatBoxProps {
  number: number;
  label: string;
  currency?: string; // Optional currency symbol, for cases like rupee sign
}

const StatBox: React.FC<StatBoxProps> = ({ number, label, currency }) => {
  return (
    <Box
      textAlign="center"
      boxShadow="sm"
      width="326px"
      height={"96px"}
      borderRadius={"6px"}
      padding={"16px"}
      border={"border: 1px solid #0000001A"}
      bg={"#F8F8F8"}
    >
      <VStack spacing="5px">
        <Text fontSize={"22px"} fontWeight={400} color={"#2F3036"}>
          {currency ? `${currency} ${number}` : number}
        </Text>
        <Text fontSize={"16px"} fontWeight={400} color={"#00000080"}>
          {label}
        </Text>
      </VStack>
    </Box>
  );
};

export default StatBox;
