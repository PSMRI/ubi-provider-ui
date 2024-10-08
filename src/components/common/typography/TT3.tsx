// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TT3Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TT3: FC<TT3Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="14px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TT3;
