// components/TD1.tsx
import React, { FC } from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface TD2Props extends TextProps {
  children: React.ReactNode; // Type for children
}

const TD2: FC<TD2Props> = ({ children, ...props }) => {
  return (
    <Text {...props} fontSize="36px" fontWeight="400">
      {children}
    </Text>
  );
};

export default TD2;
