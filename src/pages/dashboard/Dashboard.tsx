import { VStack } from "@chakra-ui/react";
import CommonBarChart from "./CommonBarChart";
import Layout from "../../components/layout/Layout";
import BenefitSummary from "./BenefitSummary";
import KeyMatrics from "./KeyMatrics";

function Dashboard() {
  return (
    <Layout
      _titleBar={{ title: "Welcome back!" }}
      showMenu={true}
      showSearchBar={true}
      showLanguage={false}
    >
      <VStack gap="60px" py="60px">
        <KeyMatrics />
        <BenefitSummary />
        <CommonBarChart />
      </VStack>
    </Layout>
  );
}

export default Dashboard;
