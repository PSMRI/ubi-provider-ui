import React from "react";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";

interface CustomCheckboxProps {
  id: string;
  label: string;
  required: boolean;
  value: string[];
  onChange: (selectedValues: string[]) => void;
  options: { value: string; label: string }[]; // Ensure options is an array of objects
  placeholder?: string;
}

const CheckboxWidget: React.FC<CustomCheckboxProps> = ({
  id,
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "Select options",
}) => {
  // Ensure that options is an array, if not, fallback to an empty array
  const validOptions = Array.isArray(options) ? options : [];

  return (
    <FormControl id={id} isRequired={required} mt={4}>
      <FormLabel>{label}</FormLabel>
      <CheckboxGroup value={value} onChange={onChange}>
        <div>
          {validOptions.map((option) => (
            <Checkbox key={option.value} value={option.value}>
              {option.label}
            </Checkbox>
          ))}
        </div>
      </CheckboxGroup>
      <FormHelperText>{placeholder}</FormHelperText>
    </FormControl>
  );
};

export default CheckboxWidget;
