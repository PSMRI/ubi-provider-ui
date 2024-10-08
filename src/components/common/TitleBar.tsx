// src/components/TitleBar.tsx
import React from "react";
import { Box, Text } from "@chakra-ui/react";
import TH3 from "./typography/TH3";

const TitleBar: React.FC<{ title: string }> = ({ title }) => {
  return (
    <Box
      bg="#06164B"
      height="106px"
      display="flex"
      alignItems="center"
      paddingTop={"60px"}
      paddingRight={"170px"}
      paddingBottom={"60px"}
      paddingLeft={"40px"}
    >
      <TH3 color="white">{title}</TH3>
    </Box>
  );
};

export default TitleBar;
