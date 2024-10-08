import React from "react";
import KeyMatrics from "./KeyMatrics";
import BenefitSummary from "./BenefitSummary";
import Layout from "../../components/layout/Layout";
import TitleBar from "../../components/common/TitleBar";
function Dashboard() {
  return (
    <Layout showMenu={true} showSearchBar={true} showLanguage={false}>
      <TitleBar title="Welcome back!" />
      <KeyMatrics />
      <BenefitSummary />
    </Layout>
  );
}

export default Dashboard;
