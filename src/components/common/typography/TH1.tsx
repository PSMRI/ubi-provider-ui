// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TH1Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TH1: FC<TH1Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="32px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TH1;
