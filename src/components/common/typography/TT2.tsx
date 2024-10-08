// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TT2Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TT2: FC<TT2Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="16px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TT2;
