// src/components/TitleBar.tsx
import React from "react";
import { HStack } from "@chakra-ui/react";
import TH3 from "./typography/TH3";

const TitleBar: React.FC<{ title: string }> = ({ title }) => {
  return (
    <HStack bg="#06164B" pt="35px" pb={"35px"} pl={"23px"}>
      <TH3 color="white">{title}</TH3>
    </HStack>
  );
};

export default TitleBar;
