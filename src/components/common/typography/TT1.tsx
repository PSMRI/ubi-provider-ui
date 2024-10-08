// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TT1Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TT1: FC<TT1Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="22px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TT1;
