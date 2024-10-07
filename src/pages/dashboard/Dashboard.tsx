import React from "react";
import KeyMatrics from "./KeyMatrics";
import BenefitSummary from "./BenefitSummary";
import Layout from "../../components/layout/Layout";
function Dashboard() {
  return (
    <Layout>
      <KeyMatrics />
      <BenefitSummary />
    </Layout>
  );
}

export default Dashboard;
