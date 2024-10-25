import { Text } from "@chakra-ui/react";
import Chart from "react-apexcharts";

// Error boundary wrapper for the Chart component
interface ChartProps {
  options: {
    labels: string[];
    [key: string]: any; // This allows for any other properties
  };
  series: number[]; // Assuming series is an array of numbers
}
const ChartWithErrorBoundary: React.FC<ChartProps> = ({ options, series }) => {
  if (!series?.length || !options?.labels?.length) {
    return <Text>No chart data available</Text>;
  }

  try {
    return <Chart options={options} series={series} type="pie" width="300" />;
  } catch (error) {
    console.error("Chart rendering error:", error);
    return <Text>Unable to display chart</Text>;
  }
};

export default ChartWithErrorBoundary;
