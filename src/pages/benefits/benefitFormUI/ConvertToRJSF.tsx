import { JSONSchema7 } from "json-schema";

interface ApplicationFormField {
  type: string;
  name: string;
  label: string;
  required: boolean;
  options?: { value: string; label: string }[];
  multiple?: boolean;
}

interface EligibilityFormField {
  type: string;
  name: string;
  label: string;
  required: boolean;
  options?: { value: string; label: string }[];
  multiple?: boolean;
  clause?: string;
  evidence?: string;
  criteria?: {
    name: string;
    condition: string;
    conditionValues: string[] | string;
  };
  allowedProofs?: string[];
}
interface Document {
  documentType: string;
  isRequired: boolean;
  allowedProofs: string[];
}

export const convertApplicationFormFields = (
  applicationForm: ApplicationFormField[]
) => {
  const rjsfSchema: any = {
    title: "",
    type: "object",
    properties: {},
  };
  applicationForm.forEach((field) => {
    let fieldSchema: any = {
      type: "string",
      title: field.label,
    };

    if (field.type === "radio" || field.type === "select") {
      fieldSchema.enum = field.options?.map((option) => option.value);
      fieldSchema.enumNames = field.options?.map((option) => option.label);
      fieldSchema.enumSeparator = field.multiple ? "," : undefined;
    }

    if (field.required) {
      fieldSchema.required = true;
    }

    rjsfSchema.properties[field.name] = fieldSchema;
    console.log(
      `Added field to schema: ${field.name}`,
      rjsfSchema.properties[field.name]
    );
  });
  return rjsfSchema;
};

export const convertEligibilityFields = (
  eligibility: EligibilityFormField[]
): JSONSchema7 => {
  const schema: JSONSchema7 = {
    type: "object",
    properties: {},
  };

  eligibility.forEach((eligibilityField: any) => {
    const fieldLabel = `Upload document for ${eligibilityField.evidence}${
      eligibilityField.allowedProofs
        ? ` (${eligibilityField.allowedProofs.join(", ")})`
        : ""
    }`;
    schema.properties![eligibilityField.name] = {
      type: "string",
      title: fieldLabel,
      enum: eligibilityField.allowedProofs || [],
    };
  });

  return schema;
};
export const convertDocumentFields = (documents: Document[]): JSONSchema7 => {
  const schema: JSONSchema7 = {
    type: "object",
    properties: {},
  };

  documents.forEach((doc: any) => {
    schema.properties![doc.documentType] = {
      type: "string",
      title: `Upload document for ${doc.documentType}${
        doc.allowedProofs ? ` (${doc.allowedProofs.join(", ")})` : ""
      }`,
      format: "data-url",
    };
  });

  return schema;
};
export function checkUniqueField<T>(schemaArray: T[], field: keyof T): boolean {
  const seen = new Set();
  for (const item of schemaArray) {
    const value = item[field];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
  }
  return true;
}
