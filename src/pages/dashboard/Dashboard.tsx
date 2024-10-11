import React from "react";
import KeyMatrics from "./KeyMatrics";
import BenefitSummary from "./BenefitSummary";
import Layout from "../../components/layout/Layout";
import TitleBar from "../../components/common/TitleBar";
import CommonTable from "../../components/common/table/CommonTable";
import CommonBarChart from "../../components/common/charts/CommonBarChart";
function Dashboard() {
  return (
    <Layout showMenu={true} showSearchBar={true} showLanguage={false}>
      <TitleBar title="Welcome back!" />
      <KeyMatrics />
      <CommonTable />
      <CommonBarChart />
    </Layout>
  );
}

export default Dashboard;
