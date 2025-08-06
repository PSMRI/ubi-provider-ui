import { Box, Text } from "@chakra-ui/react";
import { Theme as ChakraTheme } from "@rjsf/chakra-ui";
import { withTheme } from "@rjsf/core";
import { SubmitButtonProps, getSubmitButtonOptions } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";
import { JSONSchema7 } from "json-schema";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CommonButton from "../../../components/common/buttons/SubmitButton";
import Loading from "../../../components/common/Loading";
import FormAccessibilityProvider from "../../../components/common/form/FormAccessibilityProvider";
import { getSchema, submitForm } from "../../../services/benefits";
import {
  convertApplicationFormFields,
  convertDocumentFields,
  extractUserDataForSchema,
  getDocumentFieldNames,
  getPersonalFieldNames,
  isFileUploadField,
  extractDocumentSubtype,
  extractDocumentMetadataFromSelection,
} from "./ConvertToRJSF";

// Interface for VC document structure
interface VCDocument {
  document_submission_reason: string;
  document_type: string;
  document_subtype: string;
  document_format: string;
  document_imported_from: string;
  document_content: string;
}

// Interface for file upload structure
interface FileUpload {
  [fieldName: string]: string;
}

// Interface for form submission data structure
interface FormSubmissionData {
  [key: string]: string | number | boolean | FileUpload[] | VCDocument[] | undefined;
  files?: FileUpload[];
  vc_documents?: VCDocument[];
  benefitId: string;
}
interface DocumentMetadata {
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

const Form = withTheme(ChakraTheme);
const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { uiSchema } = props;
  const { norender } = getSubmitButtonOptions(uiSchema);
  if (norender) {
    return null;
  }
  return <button type="submit" style={{ display: "none" }}></button>;
};

interface EligibilityItem {
  value: string;
  descriptor?: {
    code?: string;
    name?: string;
    short_desc?: string;
  };
  display?: boolean;
}

const BenefitApplicationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // State variables for form schema, data, refs, etc.
  const [formSchema, setFormSchema] = useState<any>(null);
  const [formData, setFormData] = useState<object>({});
  const formRef = useRef<any>(null);
  const [docSchema, setDocSchema] = useState<any>(null);
  const [extraErrors, setExtraErrors] = useState<any>(null);
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [uiSchema, setUiSchema] = useState({});
  const [reviewerComment, setReviewerComment] = useState<string | null>(null);
  const [documentFieldNames, setDocumentFieldNames] = useState<string[]>([]);
  const [docsArray, setDocsArray] = useState<DocumentMetadata[]>([]);

  // Helper function to group form fields by fieldsGroupName
  const groupFieldsByGroup = (benefit: any) => {
    const groups: Record<string, { label: string; fields: any[] }> = {};

    benefit.forEach((field: any) => {
      const groupName = field.fieldsGroupName || "default";
      const groupLabel = field.fieldsGroupLabel || "Form Fields";

      if (!groups[groupName]) {
        groups[groupName] = {
          label: groupLabel,
          fields: [],
        };
      }

      groups[groupName].fields.push(field);
    });

    return groups;
  };

  useEffect(() => {
    // Fetch and process schema data when id changes
    const getApplicationSchemaData = async (
      receivedData: any,
      benefit: any,
      documentTag: any,
      eligibilityTag: any
    ) => {
      if (benefit) {
        // Parse and group application form fields by fieldsGroupName
        const groupedFields = groupFieldsByGroup(benefit);

        // Convert grouped application form fields to RJSF schema with fieldsets
        const applicationFormSchema =
          convertApplicationFormFields(groupedFields);

        const prop = applicationFormSchema?.properties;

        // Pre-fill form data if available
        Object.keys(prop).forEach((item: string) => {
          if (receivedData?.[item] && receivedData?.[item] !== "") {
            prop[item] = {
              ...prop[item],
            };
          }
        });
        /// extract user data fields matching to schema fields
        const userData = extractUserDataForSchema(receivedData, prop);
        /// send user data fields matching to schema fields
        setFormData(userData);
        // Process eligibility and document schema
        getEligibilitySchemaData(receivedData, documentTag, eligibilityTag, {
          ...applicationFormSchema,
          properties: prop,
        });
      }
    };
        // Fetch schema from API
    const getSchemaData = async () => {
      if (id) {
        try {
          const result = await getSchema(id);
          if (!result?.responses?.[0]?.message?.catalog?.providers?.[0]?.items?.[0]) {
            throw new Error("Invalid schema response structure");
          }
        
          // Extract relevant tags from the schema response
          const schemaTag =
            result?.responses[0]?.message?.catalog?.providers?.[0]?.items?.[0]?.tags?.find(
              (tag: any) => tag?.descriptor?.code === "applicationForm"
            );
       
          // Extract relevant tags from the schema response
          const documentTag =
            result?.responses[0]?.message?.catalog?.providers?.[0]?.items?.[0]?.tags?.find(
              (tag: any) => tag?.descriptor?.code === "required-docs"
            );

          const eligibilityTag =
            result?.responses[0]?.message?.catalog?.providers?.[0]?.items?.[0]?.tags?.find(
              (tag: any) => tag?.descriptor?.code === "eligibility"
            );

          // Parse application form fields
          const parsedValues =
            schemaTag?.list?.map((item: EligibilityItem) =>
              JSON.parse(item.value)
            ) || [];

          // Use window.name for pre-filled data if available
          const useData = window.name ? JSON.parse(window.name) : null;

          if (useData?.remark) {
            setReviewerComment(useData.remark);
          }

          // Store docs array for document type and issuer extraction
          if (useData?.docs && Array.isArray(useData.docs)) {
            setDocsArray(useData.docs);
          }

          getApplicationSchemaData(
            useData,
            parsedValues,
            documentTag,
            eligibilityTag
          );
        } catch (error) {
          console.error("Error fetching schema data:", error);
          // Handle error gracefully - could set an error state or show a message
          // For now, just log the error and let the component handle the empty state
        }
      }
    };
    getSchemaData();
  }, [id]);

  // Process eligibility and document schema, merge with application schema
  const getEligibilitySchemaData = (
    formData: any,
    documentTag: any,
    eligibilityTag: any,
    applicationFormSchema: any
  ) => {
    // Parse eligibility and document schema arrays
    const eligSchemaStatic = eligibilityTag.list.map((item: EligibilityItem) =>
      JSON.parse(item.value)
    );
    const docSchemaStatic =
      documentTag?.list
        ?.filter(
          (item: any) =>
            item?.descriptor?.code === "mandatory-doc" ||
            item?.descriptor?.code === "optional-doc"
        )
        ?.map((item: any) => JSON.parse(item.value)) ?? [];

    const docSchemaArr = [...eligSchemaStatic, ...docSchemaStatic];

    // Convert eligibility and document fields to RJSF schema
    const docSchemaData = convertDocumentFields(docSchemaArr, formData?.docs);
    console.log("docSchemaData", docSchemaData);
    setDocSchema(docSchemaData);

    // Merge application and document schemas
    const properties = {
      ...(applicationFormSchema?.properties ?? {}),
      ...(docSchemaData?.properties || {}),
    };
    console.log("properties", properties);

    // Extract document field names for later classification
    const extractedDocFieldNames = getDocumentFieldNames(docSchemaData);
    setDocumentFieldNames(extractedDocFieldNames);

    // Collect required fields
    const required = Object.keys(properties).filter((key) => {
      const isRequired = properties[key].required;
      if (isRequired !== undefined) {
        delete properties[key].required;
      }
      return isRequired;
    });
    // Build the final schema
    const allSchema = {
      ...applicationFormSchema,
      required,
      properties,
    };
    console.log("allschema", allSchema);
    setFormSchema(allSchema);

    // --- CONSOLIDATED FIELDSET GROUPING ---
    const appFieldNames = Object.keys(applicationFormSchema?.properties ?? {});
    const docSchemaFieldNames = Object.keys(docSchemaData?.properties ?? {});
    const allFieldNames = [...appFieldNames, ...docSchemaFieldNames];

    // Consolidate all field groups to avoid nesting conflicts
    const consolidatedFieldGroups: Record<
      string,
      { label: string; fields: string[] }
    > = {};
    const ungroupedFields: string[] = [];

    allFieldNames.forEach((fieldName) => {
      const fieldSchema = allSchema.properties[fieldName];

      // Check if field has grouping metadata from schema
      if (fieldSchema?.fieldGroup) {
        const groupName = fieldSchema.fieldGroup.groupName;
        const groupLabel = fieldSchema.fieldGroup.groupLabel;

        if (!consolidatedFieldGroups[groupName]) {
          consolidatedFieldGroups[groupName] = {
            label: groupLabel,
            fields: [],
          };
        }
        consolidatedFieldGroups[groupName].fields.push(fieldName);
      } else {
        // Fields without explicit grouping go to ungrouped
        ungroupedFields.push(fieldName);
      }
    });

    // Create logical field ordering: personal fields first, then documents
    let uiOrder: string[] = [];

    // Step 1: Add personal information groups (non-document groups)
    const personalGroups = Object.keys(consolidatedFieldGroups).filter(
      (groupName) => groupName !== "documents"
    );

    personalGroups.forEach((groupName) => {
      if (consolidatedFieldGroups[groupName]) {
        uiOrder = uiOrder.concat(consolidatedFieldGroups[groupName].fields);
      }
    });

    // Step 2: Add ungrouped personal fields
    const ungroupedPersonalFields = ungroupedFields.filter(
      (fieldName) => !extractedDocFieldNames.includes(fieldName)
    );
    uiOrder = uiOrder.concat(ungroupedPersonalFields);

    // Step 3: Add document groups
    if (consolidatedFieldGroups["documents"]) {
      uiOrder = uiOrder.concat(consolidatedFieldGroups["documents"].fields);
    }

    // Step 4: Add any remaining ungrouped document fields
    const ungroupedDocFields = ungroupedFields.filter((fieldName) =>
      extractedDocFieldNames.includes(fieldName)
    );
    uiOrder = uiOrder.concat(ungroupedDocFields);

    // Build the uiSchema with proper fieldset configuration
    const uiSchema: any = {
      "ui:order": uiOrder,
    };

    // Add fieldset configuration only for grouped fields
    Object.entries(consolidatedFieldGroups).forEach(([groupName, group]) => {
      group.fields.forEach((fieldName, index) => {
        uiSchema[fieldName] = {
          ...uiSchema[fieldName],
          "ui:group": groupName,
          "ui:groupLabel": group.label,
          "ui:groupFirst": index === 0, // Mark first field in group
        };
      });
    });



    setUiSchema(uiSchema);
    // --- END CONSOLIDATED GROUPING ---
  };

  // Helper function to create VC document with actual document type and issuer from selection
  const createVCDocument = (
    fieldName: string,
    encodedContent: string,
    fieldSchema: any
  ): VCDocument => {
    const vcMeta = fieldSchema?.vcMeta;
    const formValue = (formData as any)[fieldName];

    // Extract complete document metadata from the selected document
    const { documentType, documentIssuer } =
      extractDocumentMetadataFromSelection(formValue, docsArray);
    const documentSubtype = extractDocumentSubtype(formValue, fieldSchema);

    return {
      document_submission_reason: JSON.stringify(
        vcMeta?.submissionReasons || [fieldName]
      ),
      document_type: documentType, // Real doc_type from selected document
      document_subtype: documentSubtype,
      document_format: vcMeta?.format || "json",
      document_imported_from: documentIssuer, // Real imported_from from selected document
      document_content: encodedContent,
    };
  };

  // Handle form data change
  const handleChange = ({ formData }: any) => {
    setFormData(formData);
  };

  // Enhanced form submit handler with structured output
  const handleFormSubmit = async () => {
    setDisableSubmit(true);

    try {
      const formDataNew: FormSubmissionData = { benefitId: id! };
      const allFieldNames = Object.keys(formData);
      const systemFields = ["benefitId", "docs", "orderId"];

      // Get personal field names (non-document, non-system fields)
      const personalFieldNames = getPersonalFieldNames(
        allFieldNames,
        documentFieldNames,
        systemFields
      );

      // Extract personal information
      personalFieldNames.forEach((fieldName) => {
        const value = (formData as any)[fieldName];
        if (value !== undefined && value !== null) {
          formDataNew[fieldName] = value;
        }
      });

      // Process document fields
      const files: FileUpload[] = [];
      const vcDocuments: VCDocument[] = [];

      documentFieldNames.forEach((fieldName) => {
        const fieldValue = (formData as any)[fieldName];
        if (!fieldValue) {
          console.log(`${fieldName} is missing from formData`);
          return;
        }

        const fieldSchema = formSchema?.properties?.[fieldName];
        const encodedContent = encodeToBase64(fieldValue);

        // Determine if this is a file upload or VC document based on field pattern and metadata
        const isFileUpload =
          fieldSchema?.vcMeta?.isFileUpload || isFileUploadField(fieldName);

        if (isFileUpload) {
          // Add to files array
          files.push({ [fieldName]: encodedContent });
        } else {
          // Create VC document with metadata, actual document type and issuer
          const vcDocument = createVCDocument(
            fieldName,
            encodedContent,
            fieldSchema
          );
          vcDocuments.push(vcDocument);
        }
      });

      // Add arrays to submission data only if they have content
      if (files.length > 0) {
        formDataNew.files = files;
      }

      if (vcDocuments.length > 0) {
        formDataNew.vc_documents = vcDocuments;
      }

      // Submit the form
      const response = await submitForm(formDataNew as any);
      if (response) {
        setDisableSubmit(true);
        const targetOrigin = import.meta.env.VITE_BENEFICIERY_IFRAME_URL;
        window.parent.postMessage(
          {
            type: "FORM_SUBMIT",
            data: { submit: response, userData: formDataNew },
          },
          targetOrigin
        );
      } else {
        setDisableSubmit(false);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setDisableSubmit(false);
    }
  };

  // Show loading spinner if schema is not ready
  if (!formSchema) {
    return <Loading />;
  }

  const getMarginTop = () => {
    return reviewerComment?.trim() ? "25%" : "0";
  };

  // Render the form
  return (
    <Box p={4} mt={getMarginTop()}>
      {reviewerComment?.trim() && (
        <>
          {/* Backdrop to hide background content */}
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bgColor="rgba(255, 255, 255, 0.6)" // semi-transparent white
            backdropFilter="blur(10px)" // apply blur to what's behind
            zIndex={9}
            height={"18%"}
            mb={"10%"}
          />

          {/* Fixed Reviewer Comment Box */}
          <Box
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex={10}
            bg="orange.50"
            border="1px"
            borderColor="orange.300"
            p={4}
            borderRadius="md"
            mx={4}
            mt={4}
          >
            <Text as="p" fontWeight="bold" color="orange.800">
              Reviewer Comment:
            </Text>
            <Text as="p" mt={2} color="orange.700">
              {reviewerComment}
            </Text>
          </Box>
        </>
      )}

      <FormAccessibilityProvider
        formRef={formRef}
        uiSchema={uiSchema}
        formSchema={formSchema}
      >
        <Form
          ref={formRef}
          showErrorList={false}
          focusOnFirstError
          noHtml5Validate
          schema={formSchema as JSONSchema7}
          validator={validator}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleFormSubmit}
          templates={{ ButtonTemplates: { SubmitButton } }}
          extraErrors={extraErrors}
          uiSchema={uiSchema}
        />
      </FormAccessibilityProvider>
      <CommonButton
        label="Submit Form"
        isDisabled={disableSubmit}
        onClick={() => {
          const error: any = {};
          Object.keys(docSchema?.properties ?? {}).forEach((e: any) => {
            const field = docSchema?.properties[e];
            if (field?.enum && field.enum.length === 0) {
              error[e] = {
                __errors: [`${e} does not have a document`],
              };
            }
          });
          if (Object.keys(error).length > 0) {
            setExtraErrors(error);
          } else if (formRef.current?.validateForm()) {
            formRef?.current?.submit();
          }
        }}
      />
    </Box>
  );
};

export default BenefitApplicationForm;

function encodeToBase64(str: string) {
  try {
    return `base64,${btoa(encodeURIComponent(str))}`;
  } catch (error) {
    console.error("Failed to encode string to base64:", error);
    throw new Error("Failed to encode string to base64");
  }
}
