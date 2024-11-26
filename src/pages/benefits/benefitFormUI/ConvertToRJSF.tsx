import { JSONSchema7 } from "json-schema";

interface ApplicationFormField {
  type: string;
  name: string;
  label: string;
  required: boolean;
  options?: { value: string; label: string }[];
  multiple?: boolean;
}

interface Doc {
  doc_data: string;
  doc_datatype: string;
  doc_id: string;
  doc_name: string;
  doc_path: string;
  doc_subtype: string;
  doc_type: string;
  doc_verified: boolean;
  imported_from: string;
  is_uploaded: boolean;
  uploaded_at: string;
  user_id: string;
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
  });
  return rjsfSchema;
};

export const convertDocumentFields = (
  schemaArr: any[],
  userDocs: Doc[]
): JSONSchema7 => {
  const schema: any = {
    type: "object",
    properties: {},
  };

  // Object to hold grouped results
  const groupedByAllowedProofs: any = {};

  // Iterate through the data
  schemaArr.forEach((item) => {
    item.allowedProofs.forEach((proof: any) => {
      // If the proof does not exist in the results object, create it
      if (!groupedByAllowedProofs[proof]) {
        groupedByAllowedProofs[proof] = {
          name: proof,
          schema: [],
        };
      }
      // Push the current item to the corresponding proof's schema
      groupedByAllowedProofs[proof].schema.push(item);
    });
  });

  // Convert the results object to an array
  const schemaDoc = Object.values(groupedByAllowedProofs);
  // const userDocsDataType = userDocs?.docs_datatype || [];
  schemaDoc.forEach((field: any) => {
    const matchingDocs = userDocs?.filter((doc: Doc) =>
      field?.name?.includes(doc.doc_subtype)
    );

    const [enumValues, enumNames] = matchingDocs?.reduce(
      ([values, names]: any, doc: Doc) => {
        values.push(doc.doc_data);
        names.push(doc.doc_subtype);
        return [values, names];
      },
      [[], []]
    ) ?? [[], []];

    const fieldLabel = `Upload document for ${field.schema
      .map((e: any) =>
        e.documentType ? e.documentType : e?.criteria?.name || ""
      )
      .join(", ")}`;
    schema.properties![field?.name] = {
      type: "string",
      title: fieldLabel,
      enum: enumValues as string[],
      enumNames: enumNames as string[],
      isDocument: true,
    };
  });

  return schema;
};
