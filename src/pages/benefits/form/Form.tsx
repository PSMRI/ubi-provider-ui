import React from "react";
import Layout from "../../../components/layout/Layout";

import validator from "@rjsf/validator-ajv6";
import {
  generalInfoSchema,
  eligibilityCriteriaSchema,
  financialInformationSchema,
  termsAndConditionSchema,
} from "./schema";
import {
  generalInformationUiSchema,
  eligibilityUiSchema,
  financialInformaionUiSchema,
  termsAndConditionUiSchema,
} from "./uiSchema";

import { useNavigate, useParams } from "react-router-dom";
import TitleBar from "../../../components/common/TitleBar";
import MultiStepForm from "../../../components/common/MultiStepForm";
const fixedStep = [
  {
    step: 1,
    title: "General Information",
    schema: generalInfoSchema,
    uiSchema: generalInformationUiSchema,
    isOpen: true,
  },
  {
    step: 2,
    title: "Eligibility Criteria",
    schema: eligibilityCriteriaSchema,
    uiSchema: eligibilityUiSchema,
    isOpen: false,
  },
  {
    step: 3,
    title: "Financial Information",
    schema: financialInformationSchema,
    uiSchema: financialInformaionUiSchema,
    isOpen: false,
  },
  {
    step: 4,
    title: "Other Terms and Conditions",
    schema: termsAndConditionSchema,
    uiSchema: termsAndConditionUiSchema,
    isOpen: false,
  },
];
export default function CreateBenefitForm() {
  const [formData, setFormData] = React.useState({});
  const [steps, setSteps] = React.useState<any>({});
  const { id } = useParams();
  const navigate = useNavigate();
  React.useEffect(() => {
    setSteps(fixedStep);
  }, [id]);
  // Handle form submission
  const handleSubmit = ({ formData }: any) => {
    console.log("Submitted Data:", formData);
    setFormData(formData);
    // Navigate to next step
    navigate(`/benefits/form`); // Replace with actual step logic
  };
  return (
    <Layout showMenu={true} showSearchBar={true} showLanguage={false}>
      <TitleBar title={"Create New Benefit"} />
      {/* <Form
        schema={generalInfoSchema}
        validator={validator}
        onChange={(e) => handleGeneralInfo(e)}
      />
      <Form
        schema={eligibilityCriteriaSchema}
        uiSchema={eligibilityUiSchema}
        validator={validator}
      />
      <Form
        schema={financialInformationSchema}
        uiSchema={financialInformaionUiSchema}
        validator={validator}
      />
      <Form
        schema={termsAndConditionSchema}
        uiSchema={termsAndConditionUiSchema}
        validator={validator}
      /> */}
      {/* <Box mx="auto" mt="50px">
        <Accordion allowToggle defaultIndex={[0]}>
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Icon as={CheckCircleIcon} color={"green.500"} mr={2} />
                General Information
              </Box>
            </AccordionButton>
            <AccordionPanel>
              <Form
                schema={formSchema}
                formData={formData}
                onChange={(e) => setFormData(e.formData)}
                onSubmit={handleSubmit}
                validator={validator}
              />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Another Step (if needed)
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              <p>Content for another step.</p>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Button
          mt="20px"
          colorScheme="teal"
          onClick={() => navigate("/benefits/create/nextStep")}
        >
          Next Step
        </Button>
      </Box> */}
      <MultiStepForm
        steps={steps}
        items={fixedStep}
        formData={formData}
        onChange={(e) => setFormData(e.formData)}
        onSubmit={() => handleSubmit(formData)}
        validatorForm={validator}
      />
    </Layout>
  );
}
