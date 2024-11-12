import React from "react";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

// Create a simplified version of IconButtonProps to reduce complexity
type SimplifiedIconButtonProps = Pick<
  IconButtonProps,
  "size" | "variant" | "onClick" | "isDisabled" | "colorScheme"
>;

interface AddButtonProps extends SimplifiedIconButtonProps {}

const AddButton: React.FC<AddButtonProps> = (props) => {
  return (
    <IconButton
      {...props}
      icon={<AddIcon />}
      aria-label="Add"
      backgroundColor="#E9E7EF"
      _hover={{ backgroundColor: "#D3D0D9" }}
      color="#0037B9"
    />
  );
};

export default AddButton;
