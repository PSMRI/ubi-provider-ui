// src/components/KeyMetrics.tsx
import { HStack, Select, VStack } from "@chakra-ui/react";
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import CommonCard from "../../components/common/card/CommonCard";
import TD2 from "../../components/common/typography/TD2";
import TT1 from "../../components/common/typography/TT1";
import TT2 from "../../components/common/typography/TT2";
import PrimaryButton from "../../components/common/buttons/PrimaryButton";
import StatBox from "../../components/common/widget/StatBox"; // Reusing StatBox
import { applicantData } from "../../components/common/widget/StatData";
import { cardData } from "../../utils/dataJSON/BenefitSummary";
import Chart from "react-apexcharts";

// Pie chart data
const pieChartOptions = {
  labels: ["Remaining", "Utilised"],
  colors: ["#DDE1FF", "#06164B"],
  dataLabels: {
    enabled: true,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "left",
  },
};
const pieChartSeries = [1432000, 358000];

const KeyMetrics: React.FC = () => {
  const { t } = useTranslation();
  return (
    <VStack spacing="60px" align="stretch">
      <HStack justify="space-between">
        {/* Key Metrics Heading */}
        <TD2 color="#06164B">{t("DASHBOARD_KEY_MATRICS")}</TD2>

        {/* This Month Dropdown */}
        <Select
          w="150px"
          placeholder="This Month"
          borderColor="gray.300"
          bg="white"
          _hover={{ borderColor: "gray.400" }}
          _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
        />
      </HStack>

      <HStack align="stretch" spacing={"60px"}>
        <VStack spacing={"60px"} align="start">
          <TT1 color={"#2F3036"}>{t("DASHBOARD_APPLICANT_OVERVIEW")}</TT1>
          <VStack spacing={4}>
            {applicantData.map((item) => (
              <StatBox key={item.id} number={item.number} label={item.label} />
            ))}
          </VStack>
        </VStack>
        <VStack spacing={"60px"} align={"start"}>
          <TT1 color={"#2F3036"}>{t("DASHBOARD_FINANCIAL_OVERVIEW")}</TT1>
          <VStack bg="#F8F8F8" p="5" align="stretch">
            <TT2>
              Total Budget: <b>₹ 15,00,000</b>
            </TT2>
            <TT2>
              Number of Sponsors: <b>12</b>
            </TT2>
            <Chart
              options={pieChartOptions}
              series={pieChartSeries}
              type="pie"
              width="400"
            />
          </VStack>
        </VStack>
        <VStack spacing={"60px"} align={"start"}>
          <TT1 color={"#2F3036"}>{t("DASHBOARD_POPULAR_BENEFITS")}</TT1>
          <VStack spacing={"35px"}>
            {cardData?.map((item, index) => (
              <CommonCard key={item?.id || index} {...(item || {})} />
            ))}
          </VStack>
        </VStack>
      </HStack>
      <PrimaryButton alignSelf="center" w="500px">
        View Details
      </PrimaryButton>
    </VStack>
  );
};

export default memo(KeyMetrics);
