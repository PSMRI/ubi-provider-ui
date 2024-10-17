import React from "react";
import Chart from "react-apexcharts";
import "./ChartComponent.css"; // You will define the CSS for the columns here.

const CommonBarChart: React.FC = () => {
  // Bar chart data
  const barChartOptions = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    },
    title: {
      text: "Monthly Sales",
    },
  };

  const barChartSeries = [
    {
      name: "Sales",
      data: [30, 40, 45, 50, 49, 60],
    },
  ];

  // Pie chart data
  const pieChartOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Product A", "Product B", "Product C", "Product D"],
    title: {
      text: "Sales Distribution",
    },
  };

  const pieChartSeries = [44, 55, 13, 33];

  return (
    <div className="charts-container">
      <div className="chart-column">
        <Chart
          options={barChartOptions as ApexCharts.ApexOptions}
          series={barChartSeries}
          type="bar"
          width="400"
        />
      </div>

      <div className="chart-column">
        <Chart
          options={pieChartOptions as ApexCharts.ApexOptions}
          series={pieChartSeries}
          type="pie"
          width="400"
        />
      </div>
    </div>
  );
};

export default CommonBarChart;
