import Layout from "../../../components/layout/Layout";
import { withTheme } from "@rjsf/core";
import { Theme as ChakraUITheme } from "@rjsf/chakra-ui";
const Form = withTheme(ChakraUITheme);
import validator from "@rjsf/validator-ajv6";
import { schema } from "./schema";

export default function CreateBenefitForm() {
  return (
    <Layout>
      <Form schema={schema} validator={validator} />
    </Layout>
  );
}
