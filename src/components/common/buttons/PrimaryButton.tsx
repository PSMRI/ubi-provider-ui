import React from "react";
import { Button } from "@chakra-ui/react";
import TT3 from "../typography/TT3";

interface PrimaryButtonProps {
  children: React.ReactNode;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <Button
      colorScheme={"blue"}
      bg="#0037B9"
      variant={"solid"}
      borderRadius={"100px"}
      {...props}
    >
      <TT3>{children}</TT3>
    </Button>
  );
};

export default PrimaryButton;
