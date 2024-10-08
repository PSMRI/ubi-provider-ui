// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TL1Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TL1: FC<TL1Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="14px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TL1;
