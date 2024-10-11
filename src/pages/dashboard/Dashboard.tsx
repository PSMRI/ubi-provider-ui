import React from "react";
import { useTranslation } from "react-i18next";
import KeyMatrics from "./KeyMatrics";
import Layout from "../../components/layout/Layout";
import CommonTable from "../../components/common/table/Table";
import CommonBarChart from "../../components/common/charts/CommonBarChart";
import TD2 from "../../components/common/typography/TD2";
import { VStack, Box } from "@chakra-ui/react";
import BenefitsList from "../benefits/List";

function Dashboard() {
  const { t } = useTranslation();
  return (
    <Layout
      _titleBar={{ title: "Welcome back!" }}
      showMenu={true}
      showSearchBar={true}
      showLanguage={false}
    >
      <VStack gap="60px" pt="60px">
        <KeyMatrics />
        <BenefitsList />
        <CommonBarChart />
      </VStack>
    </Layout>
  );
}

export default Dashboard;
