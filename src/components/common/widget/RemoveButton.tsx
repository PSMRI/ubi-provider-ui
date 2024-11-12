import React from "react";
import { IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

interface RemoveButtonProps {
  [key: string]: any;
}
const RemoveButton: React.FC<RemoveButtonProps> = (btnProps) => {
  return (
    <IconButton
      {...btnProps}
      icon={<DeleteIcon />} // Render the close icon
      aria-label="Remove" // Accessible label
      bgColor="#E9E7EF" // Custom background color
      _hover={{ bg: "#D3D0D9" }} // Change background color on hover
      color={"#0037B9"}
    />
  );
};

export default RemoveButton;
