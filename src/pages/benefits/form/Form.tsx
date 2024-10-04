import Layout from "../../../components/layout/Layout";
import { withTheme } from "@rjsf/core";
import { Theme as ChakraUITheme } from "@rjsf/chakra-ui";
const Form = withTheme(ChakraUITheme);
import validator from "@rjsf/validator-ajv6";
import {
  generalInfoSchema,
  eligibilityCriteriaSchema,
  financialInformationSchema,
  termsAndConditionSchema,
} from "./schema";
import {
  eligibilityUiSchema,
  financialInformaionUiSchema,
  termsAndConditionUiSchema,
} from "./uiSchema";

export default function CreateBenefitForm() {
  return (
    <Layout>
      <Form schema={generalInfoSchema} validator={validator} />
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
      />
    </Layout>
  );
}
