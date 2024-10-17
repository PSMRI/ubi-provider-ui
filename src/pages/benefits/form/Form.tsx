import React from "react";
import Layout from "../../../components/layout/Layout";

import {
  eligibilityCriteriaSchema,
  financialInformationSchema,
  generalInfoSchema,
  termsAndConditionSchema,
} from "./schema";
import {
  eligibilityUiSchema,
  financialInformaionUiSchema,
  generalInformationUiSchema,
  termsAndConditionUiSchema,
} from "./uiSchema";

import { useNavigate } from "react-router-dom";
import MultiStepForm from "../../../components/common/MultiStepForm";
import TitleBar from "../../../components/common/TitleBar";
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
  const navigate = useNavigate();

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

      <MultiStepForm
        items={fixedStep}
        formData={formData}
        onChange={(e) => setFormData(e.formData)}
        onSubmit={() => handleSubmit(formData)}
      />
    </Layout>
  );
}
