// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TL3Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TL3: FC<TL3Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="11px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TL3;
