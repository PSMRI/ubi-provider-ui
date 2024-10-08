// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TD1Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TD1: FC<TD1Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="45px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TD1;
