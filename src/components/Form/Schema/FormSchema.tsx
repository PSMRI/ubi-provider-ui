import React from "react";
import { withTheme } from "@rjsf/core";
import { Theme as ChakraUITheme } from "@rjsf/chakra-ui";
const Form = withTheme(ChakraUITheme);
import { JSONSchema7 } from "json-schema"; // Use this for the schema type
import validator from "@rjsf/validator-ajv6";
// Define your JSON Schema for the form
const schema: JSONSchema7 = {
  title: "General Information",
  type: "object",
  required: ["firstName", "lastName", "age"],
  properties: {
    benefitName: { type: "string", title: "Benefit Name" },
    benefitProvider: { type: "string", title: "Benefit Provider" },
    benefitSponsor1: { type: "string", title: "Benefit Sponsor-1" },
    sponsor1Entity: { type: "string", title: "Sponsor-1 Entity Type" },
    sponsor1Share: { type: "string", title: "Sponsor-1 Share (Percentage)" },
    benefitSponsor2: { type: "string", title: "Benefit Sponsor-2" },
    sponsor2Entity: { type: "string", title: "Sponsor-2 Entity Type" },
    sponsor2Share: { type: "string", title: "Sponsor-2 Share (Percentage)" },
    description: { type: "string", title: "Description" },
  },
};

// Form Component
const FormSchema: React.FC = () => {
  return (
    <Form schema={schema} validator={validator}>
      <div />
    </Form>
  );
};

export default FormSchema;
