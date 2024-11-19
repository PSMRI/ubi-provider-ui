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
  convertEligibilityFields,
  convertDocumentFields,
  checkUniqueField,
} from "./ConvertToRJSF";
import { SubmitButtonProps, getSubmitButtonOptions } from "@rjsf/utils";
import CommonButton from "../../../components/common/buttons/SubmitButton";

const Form = withTheme(ChakraTheme);
const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { uiSchema } = props;
  const { norender } = getSubmitButtonOptions(uiSchema);

  if (norender) {
    return null; // Return null if "norender" flag is true
  }

  return <button type="submit" style={{ display: "none" }}></button>;
};

const BenefitFormUI: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [applicationFormDetails, setApplicationFormDetails] =
    useState<any>(null);
  const [eligibilityFormDetails, setEligibilityFormDetails] =
    useState<any>(null);
  const [documentFormDetails, setDocumentFormDetails] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  //   useEffect(() => {
  //     const fetchSchemaDetails = async () => {
  //       try {
  //         const response = await axios.get(
  //           `http://localhost:5173/api/benefit/${id}`
  //         );
  //         setSchemaDetails(response.data);
  //       } catch (error) {
  //         console.error("Error fetching schema details:", error);
  //       }
  //     };

  //     if (id) {
  //       fetchSchemaDetails();
  //     }
  //   }, [id]);

  //   if (!schemaDetails) {
  //     return <div>Loading...</div>;
  //   }

  //   const { applicationForm, document } = schemaDetails;
  useEffect(() => {
    if (id) {
      const applicationSchema = preMatricScholarshipSC.en.applicationForm;

      const eligibilitySchema = preMatricScholarshipSC.en.eligibility.map(
        (eligibility: any) => ({
          ...eligibility,

          name: eligibility.evidence,
          label: eligibility?.criteria?.name,
          required: eligibility.allowedproofs?.length > 0,
        })
      );
      const documentSchema = preMatricScholarshipSC.en.documents;

      //   const applicationformSchema = convertToRJSFFormat(scholarshipSchema);
      const applicationFormSchema =
        convertApplicationFormFields(applicationSchema);
      const isEligibilityUnique = checkUniqueField(
        eligibilitySchema,
        "evidence"
      );
      const isDocumentsUnique = checkUniqueField(
        documentSchema,
        "documentType"
      );
      if (isEligibilityUnique && isDocumentsUnique) {
        const eligibilityFormSchema =
          convertEligibilityFields(eligibilitySchema);
        const documentFormSchema = convertDocumentFields(documentSchema);
        setEligibilityFormDetails(eligibilityFormSchema);
        setDocumentFormDetails(documentFormSchema);
      }

      setApplicationFormDetails(applicationFormSchema);
    } else {
      console.log("");
    }
  }, [id]);

  const handleFormChange = ({ formData }: any) => {
    setFormData(formData);
  };
  useEffect(() => {
    console.log("schemaDetails updated:", applicationFormDetails);
  }, [applicationFormDetails]);

  if (!applicationFormDetails) {
    return <Box>Loading...</Box>;
  }
  if (!eligibilityFormDetails || !documentFormDetails) {
    return <Box>Loading...</Box>;
  }
  const handleExternalFormSubmit = async () => {
    console.log("Form data submitted:", formData);
  };
  return (
    <ChakraProvider>
      <Box maxW="600px" mx="auto" p="4">
        <Form
          schema={applicationFormDetails as JSONSchema7}
          validator={validator}
          formData={formData}
          onChange={handleFormChange}
          templates={{ ButtonTemplates: { SubmitButton } }}
        />
        <Form
          schema={eligibilityFormDetails as JSONSchema7}
          uiSchema={eligibilityFormDetails.uiSchema}
          validator={validator}
          formData={formData}
          onChange={handleFormChange}
          templates={{ ButtonTemplates: { SubmitButton } }}
        />
        <Form
          schema={documentFormDetails as JSONSchema7}
          uiSchema={documentFormDetails.uiSchema}
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
