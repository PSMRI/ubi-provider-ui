// DetailsRow.tsx
import React, { useEffect, useState } from "react";
import { HStack, VStack, Text } from "@chakra-ui/react";
import Chart from "react-apexcharts";
import { formatDate } from "../../services/dashboard";

interface Sponsor {
  sponsor_name: string;
  share_percent: number;
}

interface DetailData {
  id: string;
  sponsors: Sponsor[];
  price: number;
  benefit: any[];
  application_deadline: string; // or whatever type it should be
}

interface ChartData {
  options: {
    labels: string[];
    colors: string[];
    dataLabels: {
      enabled: boolean;
    };
    legend: {
      position: string;
      horizontalAlign: string;
    };
    plotOptions: {
      pie: {
        startAngle: number;
      };
    };
  };
  series: number[];
}

const DetailsRow: React.FC<{ detailData: DetailData }> = ({ detailData }) => {
  const [chartData, setChartData] = useState<ChartData | null>(null);

  useEffect(() => {
    if (detailData?.sponsors) {
      setChartData({
        options: {
          labels: detailData?.sponsors?.map((e) => e.sponsor_name),
          colors: ["#06164B", "#DDE1FF"],
          dataLabels: {
            enabled: true,
          },
          legend: {
            position: "bottom",
            horizontalAlign: "left",
          },
          plotOptions: { pie: { startAngle: 45 } },
        },
        series: detailData?.sponsors.map((e) => e.share_percent),
      });
    }
  }, [detailData]);

  return (
    <HStack align="stretch" spacing={"60px"}>
      <VStack spacing={"60px"} align="start">
        <VStack bg="#F8F8F8" p="5" align="stretch" flex="1">
          <Text fontSize="16px" fontWeight="400">
            Total Budget: <b>₹ {detailData?.price}</b>
          </Text>
          <Text fontSize="16px" fontWeight="400">
            {"Number of Sponsors: "}
            <b>{detailData?.sponsors.length}</b>
          </Text>
          <Chart
            key={detailData?.id}
            options={(chartData?.options as any) || {}}
            series={chartData?.series || []}
            type="pie"
            width="300"
          />
        </VStack>
      </VStack>

      <VStack spacing={"60px"} align="start">
        <VStack bg="#F8F8F8" p="5" align="stretch" flex="1">
          <Text fontSize={"14px"} fontWeight={"400px"}>
            Deadlines
          </Text>
          <Text fontSize={"12px"} fontWeight={"400px"}>
            Current Deadline:
            <p>{formatDate(detailData?.application_deadline)}</p>
          </Text>
        </VStack>
      </VStack>
    </HStack>
  );
};

export default DetailsRow;
