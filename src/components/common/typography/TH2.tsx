// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TH2Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TH2: FC<TH2Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="28px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TH2;
