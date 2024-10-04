import React from "react";
import { withTheme } from "@rjsf/core";
import { Theme as ChakraUITheme } from "@rjsf/chakra-ui";
const Form = withTheme(ChakraUITheme);
import { JSONSchema7 } from "json-schema"; // Use this for the schema type
import validator from "@rjsf/validator-ajv6";
// Define your JSON Schema for the form
const schema: JSONSchema7 = {
  title: "RJSF From",
  type: "object",
  required: ["name"],
  properties: {
    name: { type: "string", title: "Benefit Name" },
  },
};

// Form Component
const FormSchema: React.FC = () => {
  return <Form validator={validator} schema={schema} />;
};

export default FormSchema;
