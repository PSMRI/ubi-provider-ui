// src/components/StatBox.tsx
import React from "react";
import { Box, Text, VStack } from "@chakra-ui/react";
import TT1 from "../typography/TT1";
import TT2 from "../typography/TT2";

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
        <TT1 color={"#2F3036"}>
          {currency ? `${currency} ${number}` : number}
        </TT1>
        <TT2 color={"#00000080"}>{label}</TT2>
      </VStack>
    </Box>
  );
};

export default StatBox;
