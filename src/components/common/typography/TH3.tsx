// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TH3Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TH3: FC<TH3Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="24px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TH3;
