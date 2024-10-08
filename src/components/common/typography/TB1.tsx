// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TB1Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TB1: FC<TB1Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="16px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TB1;
