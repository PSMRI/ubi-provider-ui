import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { TT1, TT2, TD2 } from "@common";
import { useTranslation } from "react-i18next";
import { HStack, VStack, Select } from "@chakra-ui/react";

// Pie chart data
const data = [
  {
    title: "Applicants vs. Disbursals",
    count: "89%",
    type: "bar",
    options: {
      colors: [
        "#06164B",
        "#06164B",
        "#06164B",
        "#06164B",
        "#06164B",
        "#06164B",
      ],
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: Array.from({ length: 7 }, (_, i) =>
          new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleString(
            "en-us",
            {
              weekday: "short",
            }
          )
        ),
      },
    },
    series: [
      {
        name: "Percentage",
        data: [30, 40, 45, 50, 49, 60],
      },
    ],
  },
  {
    title: "Breakdown by Gender",
    count: "104",
    type: "pie",
    footerText: "Gender",
    options: {
      labels: ["Remaining", "Utilised"],
      colors: ["#DDE1FF", "#06164B"],
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
      },
    },
    series: [1432000, 358000],
  },
  {
    title: "Breakdown by Caste",
    count: "204",
    footerText: "Caste",
    type: "pie",
    options: {
      labels: ["Remaining", "Utilised"],
      colors: ["#DDE1FF", "#06164B"],
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
      },
    },
    series: [1432000, 358000],
  },
  {
    title: "Breakdown by Level of Study",
    count: "547",
    footerText: "Age Group",
    type: "pie",
    options: {
      labels: ["Remaining", "Utilised"],
      colors: ["#DDE1FF", "#06164B"],
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
      },
    },
    series: [1432000, 358000],
  },
  {
    title: "Day Scholar/Hostler Ratio",
    count: "47",
    footerText: "Ratio",
    type: "pie",
    options: {
      labels: ["Remaining", "Utilised"],
      colors: ["#DDE1FF", "#06164B"],
      dataLabels: {
        enabled: true,
      },
      legend: {
        position: "bottom",
        horizontalAlign: "left",
      },
    },
    series: [1432000, 358000],
  },
];

const CommonBarChart: React.FC = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    setChartData(data);
  }, []);
  return (
    <VStack spacing="60px" align="stretch" px="170px" pb="60px">
      <HStack justify="space-between">
        {/* Key Metrics Heading */}
        <TD2 color="#06164B">{t("DASHBOARD_VISUAL_REPRESENTATION")}</TD2>

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
      <HStack align="stretch" spacing={"40px"}>
        {chartData?.map((chartItem) => (
          <VStack
            boxShadow="0px 2px 6px 2px #00000026"
            p="5"
            align="stretch"
            key={chartItem}
          >
            <TT2>{chartItem?.title}</TT2>
            <TT2>{chartItem?.count}</TT2>
            <HStack>
              <Chart type="pie" width="200px" height="313px" {...chartItem} />
            </HStack>
            {chartItem?.footerText && <TT2>{chartItem?.footerText}</TT2>}
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
};

export default CommonBarChart;
