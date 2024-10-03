import React from "react";
import Form, { IChangeEvent } from "@rjsf/core";
import { JSONSchema7 } from "json-schema"; // Use this for the schema type
// Import the default validator
import validator from "@rjsf/validator-ajv6"; // Use AJV 8 validator
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

// Optional UI Schema for customizing the form's look
const uiSchema = {
  age: {
    "ui:widget": "updown", // Chakra UI styled number input widget
  },
};

// Form Component
const RJSFChakraForm: React.FC = () => {
  // Form submission handler
  const handleSubmit = (e: IChangeEvent) => {
    console.log("Form data:", e.formData);
  };

  return (
    <Form
      schema={schema}
      uiSchema={uiSchema}
      onSubmit={handleSubmit}
      validator={validator}
    />
  );
};

export default RJSFChakraForm;
