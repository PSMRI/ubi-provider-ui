import FormSchema from "../components/form/Schema/FormSchema";
import Layout from "../components/layout/Layout";
export default function CreateBenefitForm() {
  return (
    <Layout showMenu={true} showSearchBar={true} showLanguage={false}>
      <FormSchema />;
    </Layout>
  );
}
