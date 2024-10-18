import React from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { HStack, VStack, Select, Text } from "@chakra-ui/react";
import { visualRepresentation } from "../../utils/dataJSON/BenefitSummary";

// Define the structure for the props and visualData
interface DataItem {
  label: string;
  count: number;
}

interface VisualData {
  gender: DataItem[];
  caste: DataItem[];
  ratio: DataItem[];
}

interface ChartData {
  chartData: {
    visualData: VisualData;
  };
}

const CommonBarChart: React.FC<ChartData> = ({ chartData }) => {
  const { t } = useTranslation();
  const visualdata = chartData?.visualData;
  // Pie chart data
  const data = [
    {
      title: "Disbursal Rate",
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
      count:
        visualdata?.gender?.length > 0
          ? visualdata?.gender?.reduce((acc, item) => acc + item.count, 0)
          : 0,
      type: "pie",
      footerText: "Gender",
      options: {
        labels:
          visualdata?.gender?.length > 0
            ? visualdata?.gender?.map((e) => e.label)
            : [],
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
      series:
        visualdata?.gender?.length > 0
          ? visualdata?.gender?.map((e) => e.count)
          : [],
    },
    {
      title: "Breakdown by Caste",
      count:
        visualdata?.caste?.length > 0
          ? visualdata?.caste?.reduce((acc, item) => acc + item.count, 0)
          : 0,
      footerText: "Caste",
      type: "pie",
      options: {
        labels:
          visualdata?.caste?.length > 0
            ? visualdata?.caste?.map((e) => e.label)
            : [],
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
      series:
        visualdata?.caste?.length > 0
          ? visualdata?.caste?.map((e) => e.count)
          : [],
    },
    {
      title: "Breakdown by Level of Study",
      count: "547",
      footerText: "Standard",
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
      count:
        visualdata?.ratio?.length > 0
          ? visualdata?.ratio.reduce((acc, item) => acc + item.count, 0)
          : 0,
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
        labels:
          visualdata?.ratio?.length > 0
            ? visualdata?.ratio?.map((e) => e.label)
            : [],
        colors: ["#867fa5", "#06164B", "#DDE1FF"],
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
      },
      series:
        visualdata?.ratio?.length > 0
          ? visualdata?.ratio?.map((e) => e.count)
          : [],
    },
  ];

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
        {data?.length > 0 &&
          data?.map((chartItem) => (
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
                {(chartItem && chartItem?.type === "bar") ||
                chartItem?.type === "pie" ? (
                  <Chart
                    options={chartItem?.options}
                    series={chartItem?.series}
                    type={chartItem?.type}
                    height="300px"
                    width="191px"
                  />
                ) : null}
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
