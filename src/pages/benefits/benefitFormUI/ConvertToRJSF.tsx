import { JSONSchema7 } from "json-schema";

// Define the structure for application form fields
interface ApplicationFormField {
  type: string;
  name: string;
  label: string;
  required: boolean;
  options?: { value: string; label: string }[];
  multiple?: boolean;
}

// Define the structure for document objects
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

// Define the structure for eligibility items
interface EligItem {
  allowedProofs: string[];
  criteria: { name: string };
  isRequired?: boolean;
}

// Convert application form fields to RJSF schema
export const convertApplicationFormFields = (
  applicationForm: ApplicationFormField[]
) => {
  // Initialize the RJSF schema object
  const rjsfSchema: any = {
    title: "",
    type: "object",
    properties: {},
  };
  // Iterate over each application form field and build its schema
  applicationForm.forEach((field) => {
    // Build the schema for each field
    let fieldSchema: any = {
      type: "string",
      title: field.label,
    };
    // Add validation for bank account number
    if (field.name === "bankAccountNumber") {
      fieldSchema.minLength = 9;
      fieldSchema.maxLength = 18;
      fieldSchema.pattern = "^[0-9]+$";
    }
    // Add validation for IFSC code
    if (field.name === "bankIfscCode") {
      fieldSchema.pattern = "^[A-Z]{4}0[A-Z0-9]{6}$";
      fieldSchema.title = field.label || "Enter valid IFSC code";
    }
    // Handle radio/select fields with options
    if (field.type === "radio" || field.type === "select") {
      fieldSchema.enum = field.options?.map((option) => option.value);
      fieldSchema.enumNames = field.options?.map((option) => option.label);
    }
    // Mark field as required if applicable
    if (field.required) {
      fieldSchema.required = true;
    }
    // Add the field schema to the properties
    rjsfSchema.properties[field.name] = fieldSchema;
  });
  return rjsfSchema;
};

// Convert eligibility and document fields to RJSF schema
export const convertDocumentFields = (
  schemaArr: any[],
  userDocs: Doc[]
): JSONSchema7 => {
  // Initialize the RJSF schema object for documents
  const schema: any = {
    type: "object",
    properties: {},
  };
  // Track required fields for the root schema
  const requiredFields: string[] = [];

  // Separate eligibility and required-docs (mandatory/optional)
  const eligibilityArr = schemaArr.filter(
    (item) => item.criteria && item.allowedProofs
  );
  const requiredDocsArr = schemaArr.filter(
    (item) => !item.criteria && item.allowedProofs
  );

  // Build sets for optional-docs and mandatory-docs for quick lookup
  const optionalDocsProofs = new Set<string>();
  const mandatoryDocsProofs = new Set<string>();
  requiredDocsArr.forEach((doc) => {
    if (doc.isRequired === false && Array.isArray(doc.allowedProofs)) {
      doc.allowedProofs.forEach((proof: string) =>
        optionalDocsProofs.add(proof)
      );
    }

    if (doc.isRequired === true && Array.isArray(doc.allowedProofs)) {
      doc.allowedProofs.forEach((proof: string) =>
        mandatoryDocsProofs.add(proof)
      );
    }
  });

  // Group eligibility criteria by their allowedProofs set (even if only one proof)
  const eligProofGroups: Record<
    string,
    { criteriaNames: string[]; allowedProofs: string[]; eligs: EligItem[] }
  > = {};
  eligibilityArr.forEach((elig) => {
    const { allowedProofs, criteria } = elig;
    if (!Array.isArray(allowedProofs) || !criteria?.name) return;
    // Use sorted allowedProofs as key for grouping
    const key = JSON.stringify([...allowedProofs].sort());
    if (!eligProofGroups[key]) {
      eligProofGroups[key] = { criteriaNames: [], allowedProofs, eligs: [] };
    }
    eligProofGroups[key].criteriaNames.push(criteria.name);
    eligProofGroups[key].eligs.push(elig);
  });

  // Debug: log the eligibility proof groups
  console.log("eligProofGroups", eligProofGroups);

  // Render grouped eligibility fields
  Object.values(eligProofGroups).forEach((group) => {
    const { criteriaNames, allowedProofs, eligs } = group;
    // Check if all allowedProofs are present as either optional-doc or mandatory-doc
    const allPresent = allowedProofs.every(
      (proof: string) =>
        optionalDocsProofs.has(proof) || mandatoryDocsProofs.has(proof)
    );

    // Prepare select options from userDocs for these proofs
    const matchingDocs = userDocs?.filter((doc: Doc) =>
      allowedProofs.includes(doc.doc_subtype)
    );

    const [enumValues, enumNames] = matchingDocs?.reduce(
      (
        [values, names]: [string[], string[]],
        doc: Doc
      ): [string[], string[]] => {
        values.push(doc.doc_data);
        names.push(doc.doc_subtype);
        return [values, names];
      },
      [[], []]
    ) ?? [[], []];
    // Use / as separator for allowedProofs in the label
    const allowedProofsLabel = allowedProofs.join(" / ");
    // If all allowedProofs are present in required-docs, render as required single select
    console.log("allPresent", allPresent);
    console.log("criteriaNames", criteriaNames);

    if (allPresent && criteriaNames.length > 0) {
      // If only one criterion in the group, use its name as the field name
      // If multiple, join names, and always use _doc suffix for document select fields
      const fieldName =
        (criteriaNames.length === 1
          ? criteriaNames[0]
          : criteriaNames.join("_")) + "_doc";
      const fieldLabel = `Choose document for ${criteriaNames.join(
        ", "
      )} (${allowedProofsLabel})`;

      console.log("fieldLabel", fieldLabel);

      schema.properties![fieldName] = {
        type: "string",
        title: fieldLabel,
        required: true,
        enum: enumValues.length > 0 ? enumValues : [""],
        enumNames: (enumNames as string[]) || [],
        default: enumValues[0] || "",
      };
      requiredFields.push(fieldName);
    } else {
      // Fallback: for each eligibility criterion
      eligs.forEach((elig) => {
        const { allowedProofs, criteria } = elig as EligItem;
        if (allowedProofs.length > 1) {
          // Render a single select for all allowedProofs for this criterion
          const matchingDocs = userDocs?.filter((doc: Doc) =>
            allowedProofs.includes(doc.doc_subtype)
          );
          const [enumValues, enumNames] = matchingDocs?.reduce(
            (
              [values, names]: [string[], string[]],
              doc: Doc
            ): [string[], string[]] => {
              values.push(doc.doc_data);
              names.push(doc.doc_subtype);
              return [values, names];
            },
            [[], []]
          ) ?? [[], []];
          const allowedProofsLabel = allowedProofs.join(" / ");
          schema.properties![`${criteria.name}_doc`] = {
            type: "string",
            title: `Choose document for ${criteria.name} (${allowedProofsLabel})`,
            required: true,
            enum: enumValues.length > 0 ? enumValues : [""],
            enumNames: (enumNames as string[]) || [],
            default: enumValues[0] || "",
          };
          requiredFields.push(`${criteria.name}_doc`);
        } else {
          // Only one allowedProof, render as before
          allowedProofs.forEach((proof: string) => {
            const proofDocs = userDocs?.filter(
              (doc: Doc) => doc.doc_subtype === proof
            );
            const [proofEnumValues, proofEnumNames] = proofDocs?.reduce(
              (
                [values, names]: [string[], string[]],
                doc: Doc
              ): [string[], string[]] => {
                values.push(doc.doc_data);
                names.push(doc.doc_subtype);
                return [values, names];
              },
              [[], []]
            ) ?? [[], []];
            schema.properties![`${criteria.name}_${proof}_doc`] = {
              type: "string",
              title: `Choose document for ${criteria.name} (${proof})`,
              required: true,
              enum: proofEnumValues.length > 0 ? proofEnumValues : [""],
              enumNames: (proofEnumNames as string[]) || [],
              default: proofEnumValues[0] || "",
            };
            requiredFields.push(`${criteria.name}_${proof}_doc`);
          });
        }
      });
    }
  });

  // Add required-docs (mandatory/optional) that are not already handled

  requiredDocsArr
    .sort((a, b) => Number(b.isRequired) - Number(a.isRequired))
    .forEach((doc) => {
      if (!Array.isArray(doc.allowedProofs)) return;
      doc.allowedProofs.forEach((proof: string) => {
        // NEW LOGIC: If this is a mandatory-doc, and this proof is present in any eligibility allowedProofs (with length > 1),
        // we still want to show it as a separate required field.
        let showAsSeparateDocField = false;

        showAsSeparateDocField = Object.values(eligProofGroups).some(
          (group) =>
            group.allowedProofs.length > 1 &&
            group.allowedProofs.includes(proof)
        );

        // If not mandatory, or not in eligibility, skip if already handled
        if (!showAsSeparateDocField) {
          const alreadyHandled = Object.values(eligProofGroups).some((group) =>
            group.allowedProofs.includes(proof)
          );
          if (alreadyHandled) return;
        }

        // Prepare select options from userDocs for this proof
        const proofDocs = userDocs?.filter((d: Doc) => d.doc_subtype === proof);
        const [enumValues, enumNames] = proofDocs?.reduce(
          (
            [values, names]: [string[], string[]],
            doc: Doc
          ): [string[], string[]] => {
            values.push(doc.doc_data);
            names.push(doc.doc_subtype);
            return [values, names];
          },
          [[], []]
        ) ?? [[], []];

        schema.properties![proof] = {
          type: "string",
          title: `Choose ${proof}`,
          required: doc.isRequired || false,
          enum: enumValues.length > 0 ? enumValues : [""],
          enumNames: (enumNames as string[]) || [],
          default: enumValues[0] || "",
        };

        if (doc.isRequired) requiredFields.push(proof);
      });
    });

  // Set the required fields at the root of the schema
  schema.required = requiredFields;

  // console.log("Cschema", JSON.stringify(schema));
  return schema;
};
