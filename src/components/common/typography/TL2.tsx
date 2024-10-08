// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TL2Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TL2: FC<TL2Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="12px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TL2;
