import React from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { HStack, VStack, Select, Text } from "@chakra-ui/react";
import { visualRepresentation } from "../../utils/dataJSON/BenefitSummary";

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
      xaxis: {
        categories: visualRepresentation?.applicantsDisbursals?.map(
          (e) => e.label
        ),
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val + "%";
        },
      },
    },
    series: [
      {
        name: "Percentage",
        data: visualRepresentation?.applicantsDisbursals?.map((e) => e.count),
      },
    ],
  },
  {
    title: "Breakdown by Gender",
    count: "104",
    type: "pie",
    footerText: "Gender",
    options: {
      labels: visualRepresentation?.gender?.map((e) => e.label),
      colors: ["#867fa5", "#06164B", "#DDE1FF"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      states: {
        hover: {
          filter: {
            type: "none", // Disable hover effect
          },
        },
      },
    },
    series: visualRepresentation?.gender?.map((e) => e.count),
  },
  {
    title: "Breakdown by Caste",
    count: "204",
    footerText: "Caste",
    type: "pie",
    options: {
      labels: visualRepresentation?.caste?.map((e) => e.label),
      colors: ["#867fa5", "#06164B", "#DDE1FF"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      states: {
        hover: {
          filter: {
            type: "none", // Disable hover effect
          },
        },
      },
    },
    series: visualRepresentation?.caste?.map((e) => e.count),
  },
  {
    title: "Breakdown by Level of Study",
    count: "547",
    footerText: "Age Group",
    type: "pie",
    options: {
      labels: visualRepresentation?.age?.map((e) => e.label),
      colors: ["#867fa5", "#06164B", "#DDE1FF"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      states: {
        hover: {
          filter: {
            type: "none", // Disable hover effect
          },
        },
      },
    },
    series: visualRepresentation?.age?.map((e) => e.count),
  },
  {
    title: "Day Scholar / Hostler Ratio",
    count: "47",
    footerText: "Ratio",
    type: "pie",
    options: {
      states: {
        hover: {
          filter: {
            type: "none", // Disable hover effect
          },
        },
      },
      labels: visualRepresentation?.ratio?.map((e) => e.label),
      colors: ["#867fa5", "#06164B", "#DDE1FF"],
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
    },
    series: visualRepresentation?.ratio?.map((e) => e.count),
  },
];

const CommonBarChart: React.FC = () => {
  const { t } = useTranslation();

  return (
    <VStack spacing="60px" align="stretch" px="170px" pb="60px">
      <HStack justify="space-between">
        {/* Key Metrics Heading */}
        <Text fontSize="36px" fontWeight="400" color="#06164B">
          {t("DASHBOARD_VISUAL_REPRESENTATION")}
        </Text>

        {/* October 2024 Dropdown */}
        <Select
          w="175px"
          placeholder="October 2024"
          borderColor="gray.300"
          bg="white"
          _hover={{ borderColor: "gray.400" }}
          _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
        />
      </HStack>
      <HStack align="stretch" spacing={"35px"}>
        {data?.map((chartItem) => (
          <VStack
            boxShadow="0px 2px 6px 2px #00000026"
            p="4"
            align="stretch"
            key={chartItem?.title}
          >
            <Text fontSize="22px" fontWeight="400">
              {chartItem?.title}
            </Text>
            <Text fontSize="16px" fontWeight="400">
              {chartItem?.count}
            </Text>
            <HStack minH="313px" align="stretch">
              <Chart
                options={chartItem?.options}
                series={chartItem?.series}
                type="pie"
                height="300px"
                width="191px"
              />
            </HStack>
            {chartItem?.footerText && (
              <Text fontSize="16px" fontWeight="400">
                {chartItem?.footerText}
              </Text>
            )}
          </VStack>
        ))}
      </HStack>
    </VStack>
  );
};

export default CommonBarChart;
