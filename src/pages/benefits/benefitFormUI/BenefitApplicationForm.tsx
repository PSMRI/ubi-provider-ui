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
} from "./ConvertToRJSF";


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
        /// extract user data fields maching to scheme fields
        const userData = extractUserDataForSchema(receivedData, prop);
        /// send user data fields maching to scheme fields
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
         const result = await getSchema(id);
        // Extract relevant tags from the schema response       
        const schemaTag =
          result?.responses[0]?.message?.catalog?.providers?.[0]?.items?.[0]?.tags?.find(
            (tag: any) => tag?.descriptor?.code === "applicationForm"
          );

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
        getApplicationSchemaData(
          useData,
          parsedValues,
          documentTag,
          eligibilityTag
        );
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

    // --- FIELDSET GROUPING AND ORDERING ---
    const appFieldNames = Object.keys(applicationFormSchema?.properties ?? {});
    const docFieldNames = Object.keys(docSchemaData?.properties ?? {});
    const allFieldNames = [...appFieldNames, ...docFieldNames];

    // Group all fields (application + document) by their fieldGroup metadata
    const fieldGroups: Record<string, { label: string; fields: string[] }> = {};
    const ungroupedFields: string[] = [];

    allFieldNames.forEach((fieldName) => {
      const fieldSchema = allSchema.properties[fieldName];
      if (fieldSchema?.fieldGroup) {
        const groupName = fieldSchema.fieldGroup.groupName;
        const groupLabel = fieldSchema.fieldGroup.groupLabel;

        if (!fieldGroups[groupName]) {
          fieldGroups[groupName] = { label: groupLabel, fields: [] };
        }
        fieldGroups[groupName].fields.push(fieldName);
      } else {
        ungroupedFields.push(fieldName);
      }
    });

    // Create UI order with fieldset grouping
    let uiOrder: string[] = [];

    // Separate document groups from other groups
    const documentGroups: string[] = [];
    const otherGroups: string[] = [];

    Object.keys(fieldGroups).forEach((groupName) => {
      if (groupName === "documents") {
        documentGroups.push(groupName);
      } else {
        otherGroups.push(groupName);
      }
    });

    // Add non-document groups first (in natural order)
    otherGroups.forEach((groupName) => {
      if (fieldGroups[groupName]) {
        uiOrder = uiOrder.concat(fieldGroups[groupName].fields);
      }
    });

    // Add document groups at the end
    documentGroups.forEach((groupName) => {
      if (fieldGroups[groupName]) {
        uiOrder = uiOrder.concat(fieldGroups[groupName].fields);
      }
    });

    // Add ungrouped fields at the end
    uiOrder = uiOrder.concat(ungroupedFields);

    // Build the uiSchema with fieldset configuration
    const uiSchema: any = {
      "ui:order": uiOrder,
    };

    // Add fieldset configuration for grouped fields
    Object.entries(fieldGroups).forEach(([groupName, group]) => {
      group.fields.forEach((fieldName, index) => {
        uiSchema[fieldName] = {
          ...uiSchema[fieldName],
          "ui:group": groupName,
          "ui:groupLabel": group.label,
          "ui:groupFirst": index === 0, // Mark first field in group
        };
      });
    });

    console.log("Final UI Schema:", uiSchema);

    setUiSchema(uiSchema);
    // --- END ORDERING ---
  };

  // Note: Field grouping and accessibility styling is now handled by FormAccessibilityProvider

  // Handle form data change
  const handleChange = ({ formData }: any) => {
    setFormData(formData);
  };

  // Handle form submit
  const handleFormSubmit = async () => {
    setDisableSubmit(true);

    const formDataNew: any = { ...formData };

    formDataNew.benefitId = id;
    delete formDataNew.docs;

    // Encode document fields to base64
    Object.keys(docSchema?.properties ?? {}).forEach((e: any) => {
      if (formDataNew[e]) {
        formDataNew[e] = encodeToBase64(formDataNew?.[e]);
      } else {
        console.log(`${e} is missing from formDataNew`);
      }
    });
    console.log("formDataNew", formDataNew);

    // Submit the form
    const response = await submitForm(formDataNew);
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
          let error: any = {};
          Object.keys(docSchema?.properties ?? {}).forEach((e: any) => {
            const field = docSchema?.properties[e];
            if (field?.enum && field.enum.length === 0) {
              error[e] = {
                __errors: [`${e} is not have document`],
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
