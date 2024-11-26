import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { JSONSchema7 } from "json-schema";
import validator from "@rjsf/validator-ajv6";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { preMatricScholarshipSC } from "./BenefitSchema";
import { withTheme } from "@rjsf/core";
import { Theme as ChakraTheme } from "@rjsf/chakra-ui";
import {
  convertApplicationFormFields,
  convertDocumentFields,
} from "./ConvertToRJSF";
import { SubmitButtonProps, getSubmitButtonOptions } from "@rjsf/utils";
import CommonButton from "../../../components/common/buttons/SubmitButton";
import { submitForm } from "../../../services/benefits";

const Form = withTheme(ChakraTheme);
const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { uiSchema } = props;
  const { norender } = getSubmitButtonOptions(uiSchema);

  if (norender) {
    return null; // Return null if "norender" flag is true
  }

  return <button type="submit" style={{ display: "none" }}></button>;
};
const uiSchema = {
  certificateType: {
    "ui:widget": "select", // Ensure the widget matches the desired UI behavior
  },
};
const BenefitFormUI: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formSchema, setFormSchema] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [userDocs, setUserDocs] = useState<any>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      window.postMessage({ type: "FORM_SUBMIT", data: formData }, "*");

      if (event.origin !== "http://localhost:5173") {
        return;
      }

      const receivedData = event.data.prefillData;
      if (receivedData) {
        setFormData(receivedData);
      }
      setUserDocs(event?.data?.user?.data?.docs);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // Fetch schema details and populate form schemas
  useEffect(() => {
    if (id) {
      const applicationSchema = preMatricScholarshipSC.en.applicationForm;
      const eligSchemaStatic = preMatricScholarshipSC.en.eligibility;
      const docSchemaStatic = preMatricScholarshipSC.en.documents;

      const docSchemaArr = [...eligSchemaStatic, ...docSchemaStatic];
      const applicationFormSchema =
        convertApplicationFormFields(applicationSchema);
      const docSchema = convertDocumentFields(docSchemaArr, userDocs);
      setFormSchema({
        ...applicationFormSchema,
        properties: {
          ...(applicationFormSchema.properties || {}),
          ...(docSchema?.properties || {}),
        },
      });
    }
  }, [id, userDocs]);

  const handleFormChange = ({ formData: newFormData }: any) => {
    setFormData(newFormData);
  };

  // Listen for messages from the parent app to prefill the form

  // Handle form submission (optional)
  const handleExternalFormSubmit = async () => {
    console.log("base64===", formData);
    let formDataNew = { ...formData };
    console.log(formSchema?.properties, "prop");
    const list: string[] = [];

    // Iterate through the object's keys
    for (const key in formSchema?.properties) {
      if (
        formSchema?.properties.hasOwnProperty(key) &&
        formSchema?.properties[key].isDocument === true
      ) {
        list.push(key);
      }
    }
    list.forEach((e) => {
      if (formDataNew[e]) {
        formDataNew[e] = btoa(formDataNew[e]);
      }
    });
    window.parent.postMessage({ type: "FORM_SUBMIT", data: formDataNew }, "*");
    console.log("sent successfully", formDataNew);
  };

  // Show loading state if schema or form data is not ready
  if (!formSchema) {
    return <Box>Loading...</Box>;
  }
  console.log(formSchema);
  return (
    <ChakraProvider>
      <Box maxW="600px" mx="auto" p="4">
        <Form
          schema={formSchema as JSONSchema7}
          validator={validator}
          formData={formData}
          onChange={handleFormChange}
          templates={{ ButtonTemplates: { SubmitButton } }}
        />
        <CommonButton onClick={handleExternalFormSubmit} label="Submit Form" />
      </Box>
    </ChakraProvider>
  );
};

export default BenefitFormUI;
