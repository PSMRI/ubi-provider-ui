import React from "react";
import { useTranslation } from "react-i18next";
import KeyMatrics from "./KeyMatrics";
import Layout from "../../components/layout/Layout";
import CommonTable from "../../components/common/table/CommonTable";
import CommonBarChart from "../../components/common/charts/CommonBarChart";
import TD2 from "../../components/common/typography/TD2";
import { VStack, Box } from "@chakra-ui/react";

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
        <VStack spacing="60px" align="stretch">
          <TD2 color={"#2F3036"} px="170px">
            {t("DASHBOARD_ALL_BENEFITS_SUMMARY")}
          </TD2>
          <VStack spacing="60px" align="stretch" p="5">
            <Box
              p="5"
              rounded="6"
              boxShadow="0px 2px 6px 2px #00000026"
              spasing="3"
            >
              <CommonTable />
            </Box>
          </VStack>
        </VStack>
        <CommonBarChart />
      </VStack>
    </Layout>
  );
}

export default Dashboard;
