import React from "react";
import { Button, Text } from "@chakra-ui/react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  alignSelf?: string;
  w?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  alignSelf,
  w,
}) => {
  return (
    <Button
      colorScheme={"blue"}
      bg="#0037B9"
      variant={"solid"}
      borderRadius={"100px"}
      alignSelf={alignSelf}
      w={w}
    >
      <Text fontSize="14px" fontWeight="400">
        {children}
      </Text>
    </Button>
  );
};

export default PrimaryButton;
