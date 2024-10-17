// src/components/TitleBar.tsx
import React from "react";
import { HStack, Text } from "@chakra-ui/react";

const TitleBar: React.FC<{ title: string }> = ({ title }) => {
  return (
    <HStack bg="#06164B" pt="35px" pb={"35px"} pl={"23px"}>
      <Text fontSize={"24px"} fontWeight={400} color="white">
        {title}
      </Text>
    </HStack>
  );
};

export default TitleBar;
