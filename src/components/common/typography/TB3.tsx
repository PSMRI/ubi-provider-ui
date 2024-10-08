// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TB3Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TB3: FC<TB3Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="12px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TB3;
