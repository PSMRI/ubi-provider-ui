import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Divider,
  HStack,
  Icon,
  VStack,
} from "@chakra-ui/react";
import { Theme as ChakraUITheme } from "@rjsf/chakra-ui";
import { withTheme } from "@rjsf/core";
import { JSONSchema7 } from "json-schema"; // Use this for the schema type
import React, { useState } from "react";
const Form = withTheme(ChakraUITheme);
const stepsData = [
  {
    step: 1,
    title: "General Information",
    description: "Fill out the general information form.",
  },
  {
    step: 2,
    title: "Eligibility Criteria",
    description: "Provide the eligibility criteria details.",
  },
  {
    step: 3,
    title: "Financial Information",
    description: "Submit your financial details.",
  },
  {
    step: 4,
    title: "Review & Submit",
    description: "Review all information and submit the form.",
  },
];

interface StepItem {
  step: number;
  title: string;
  schema: JSONSchema7; // Use the appropriate type for your schema
  isOpen: boolean;
}

interface MultiStepFormProps {
  items: StepItem[];
  formData: Record<string, any>; // Adjust this type as per your form data structure
  onChange: (data: Record<string, any>) => void; // Function to handle form data changes
  onSubmit: () => void; // Function to handle form submission
  validatorForm?: (data: Record<string, any>) => boolean; // Optional validator function
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
  items,
  formData,
  onChange,
  onSubmit,
  validatorForm,
}) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  return (
    <Box p={5} mx="auto">
      <Accordion allowToggle>
        {items?.map((stepItem, index) => (
          <React.Fragment key={stepItem?.step}>
            <AccordionItem border="none">
              <HStack spacing={4} align="flex-start">
                {/* Vertical Dotted Line and Check Icon */}
                <VStack
                  spacing={0}
                  align="center"
                  position="relative"
                  minH="60px"
                >
                  <Icon
                    as={
                      completedSteps.includes(stepItem.step)
                        ? CheckCircleIcon
                        : WarningIcon
                    }
                    color={
                      completedSteps.includes(stepItem.step)
                        ? "#0B7B69"
                        : "#EDA145"
                    }
                    boxSize={5}
                    position="relative"
                    zIndex={1}
                  />
                  {index < stepsData.length - 1 && (
                    <Divider
                      orientation="vertical"
                      borderWidth="2px"
                      borderStyle="dotted"
                      height="40px"
                      mt={2}
                    />
                  )}
                </VStack>

                <Box flex="1">
                  <AccordionButton
                    _focus={{ boxShadow: "none" }}
                    _hover={{ bg: "none" }}
                    _expanded={{ bg: "none" }}
                    px={0}
                  >
                    <Box flex="1" textAlign="left" fontWeight="bold">
                      {stepItem.title}
                    </Box>
                  </AccordionButton>

                  <AccordionPanel pb={4}>
                    {stepItem?.schema && (
                      <Form
                        schema={stepItem?.schema}
                        formData={formData} //prps
                        onChange={onChange}
                        onSubmit={onSubmit}
                        uiSchema={stepItem?.uiSchema}
                        validator={validatorForm}
                      />
                    )}
                  </AccordionPanel>
                </Box>
              </HStack>
            </AccordionItem>
          </React.Fragment>
        ))}
      </Accordion>
    </Box>
  );
};

export default MultiStepForm;
