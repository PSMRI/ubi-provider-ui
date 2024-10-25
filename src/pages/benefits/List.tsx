import {
  ChevronRightIcon,
  EditIcon,
  SearchIcon,
  SmallAddIcon,
} from "@chakra-ui/icons";
import {
  Button,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import Tab from "../../components/common/Tab";
import Table from "../../components/common/table/Table";
import { DataType } from "ka-table/enums";
import { ICellTextProps } from "ka-table/props";
import React, { memo, useEffect, useState } from "react";
import { useTableInstance } from "ka-table";
import { detailViewRow, formatDate } from "../../services/dashboard";
import ChartWithErrorBoundary from "./ChartWithErrorBoundary";
import { useTranslation } from "react-i18next";

interface Sponsor {
  sponsor_name: string;
  share_percent: number;
}

interface DetailData {
  id: string;
  sponsors: Sponsor[];
  price: number;
  benefit: any[]; // Define this more specifically if you have a better shape
  // Add other properties based on the API response
}
const columns = [
  { key: "name", title: "Name", dataType: DataType.String },
  { key: "applicants", title: "Applicants", dataType: DataType.Number },
  { key: "approved", title: "Approved", dataType: DataType.Number },
  { key: "rejected", title: "Rejected", dataType: DataType.Number },
  {
    key: "disbursalPending",
    title: "Disbursal Pending",
    dataType: DataType.Number,
  },
  { key: "deadline", title: "Deadline", dataType: DataType.String },
  {
    key: "actions",
    title: "Actions",
    dataType: DataType.String,
  },
];

const ActionCell = ({
  rowKeyValue,
  isDetailsRowShown,
  rowData,
  setDetailData, // Receive the setDetailData function
}: ICellTextProps & { setDetailData: (data: any) => void }) => {
  const table = useTableInstance();

  const fetchRowDetails = async (id: string) => {
    try {
      const response = await detailViewRow(id);
      setDetailData(response?.benefit || null);
      console.log("Fetched row details:", response);
      // Handle API response (update UI or state with the response)
    } catch (error) {
      console.error("Error fetching row details:", error);
    }
  };
  // Method to show the details row
  const showDetails = async () => {
    table.showDetailsRow(rowKeyValue);
    await fetchRowDetails(rowData?.rowData?.documentId);
  };

  // Method to hide the details row
  const hideDetails = async () => {
    table.hideDetailsRow(rowKeyValue);
  };

  return (
    <HStack>
      <IconButton aria-label="Edit" icon={<EditIcon />} size="lg" />
      <IconButton
        aria-label={isDetailsRowShown ? "Hide Details" : "Show Details"}
        icon={
          <ChevronRightIcon
            transform={isDetailsRowShown ? "rotate(90deg)" : "rotate(0deg)"}
            transition="transform 0.2s"
          />
        }
        onClick={isDetailsRowShown ? hideDetails : showDetails}
        variant="ghost"
      />
    </HStack>
  );
};

const DeadLineCell = (prop: ICellTextProps) => {
  return (
    <HStack>
      <Text fontSize="16px" fontWeight="400">
        {prop?.value
          ? new Date(prop.value).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : ""}
        <sup style={{ color: "blue" }}>+3</sup>
      </Text>
    </HStack>
  );
};

const BenefitsList: React.FC<{
  _vstack?: object;
  benefitData?: { benefit_summary: { status: string }[] };
}> = memo(({ _vstack, benefitData }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);
  const [detailData, setDetailData] = useState<DetailData[]>([]);
  useEffect(() => {
    const init = async () => {
      // Filtering data based on the selected tab (Active, Closed, Drafts)
      if (benefitData?.benefit_summary) {
        const filteredTableData = benefitData?.benefit_summary?.filter(
          (item) => {
            switch (activeTab) {
              case 0:
                return item?.status === "active";
              case 1:
                return item.status === "closed";
              case 2:
                return item.status === "draft";
              default:
                return "No data found";
            }
          }
        );
        setData(filteredTableData as any);
      }
    };
    init();
  }, [activeTab, benefitData]);

  const handleTabClick = (tab: string) => {
    setActiveTab(parseInt(tab, 10));
  };
  const handleDetailData = (data: DetailData) => {
    setDetailData((prevData) => {
      const exists = prevData.some((item) => item.id === data.id);
      if (exists) {
        return prevData.map((item) => (item.id === data.id ? data : item));
      }
      return [...prevData, data];
    });
  };
  const detailRowdata = (props: any) =>
    detailData?.find((item) => item?.id === props?.rowData.id) || null;
  return (
    <VStack spacing="20px" align="stretch" {..._vstack}>
      <HStack justifyContent="space-between">
        <Tab
          activeIndex={activeTab}
          handleTabClick={(index: number) =>
            handleTabClick(index.toString() as "0" | "1" | "2")
          }
          tabs={[
            { label: "Active", value: "0" },
            { label: "Closed", value: "1" },
            { label: "Drafts", value: "2" },
          ]}
        />

        <InputGroup maxWidth="300px" rounded={"full"} size="lg">
          <Input placeholder="Search by name.." rounded={"full"} bg="#E9E7EF" />
          <InputRightElement>
            <SearchIcon color="gray.500" />
          </InputRightElement>
        </InputGroup>
      </HStack>
      <Table
        columns={columns}
        data={data?.length > 0 ? data : []}
        rowKeyField={"id"}
        childComponents={{
          cellText: {
            content: (props: ICellTextProps) =>
              customCellText(props, handleDetailData),
          },
          detailsRow: {
            content: (props: any) =>
              detailsRow({ detailData: detailRowdata(props) }),
          },
        }}
      />
    </VStack>
  );
});

export default BenefitsList;

const customCellText = (
  props: ICellTextProps,
  handleDetailData: (data: DetailData) => void
) => {
  switch (props.column.key) {
    case "deadline":
      return <DeadLineCell {...props} />;
    case "actions":
      return (
        <ActionCell
          {...(props as any)}
          rowData={props}
          setDetailData={handleDetailData}
        />
      );
    default:
      return props.value;
  }
};

const detailsRow = ({ detailData }: { detailData: any }) => {
  // Pie chart data
  const { t } = useTranslation();

  const chartData = {
    options: {
      labels: detailData?.sponsors?.map((e: Sponsor) => e.sponsor_name),
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
    series: detailData?.sponsors.map((e: Sponsor) => e.share_percent),
  };

  return (
    <HStack align="stretch" spacing={"60px"}>
      <VStack spacing={"60px"} align="start">
        <VStack bg="#F8F8F8" p="5" align="stretch" flex="1">
          <Text fontSize="16px" fontWeight="400">
            {t("DASHBOARD_ALL_BENEFITS_SUMMARY_DETAIL_ROW_TITLE")}:{" "}
            <b>₹ {detailData?.price}</b>
          </Text>
          <Text fontSize="16px" fontWeight="400">
            {"Number of Sponsors: "}
            <b>{detailData?.sponsors.length}</b>
          </Text>

          <ChartWithErrorBoundary
            options={chartData?.options}
            series={chartData?.series}
          />
        </VStack>
      </VStack>

      <VStack spacing={"60px"} align="start">
        <VStack bg="#F8F8F8" p="5" align="stretch" flex="1">
          <Text fontSize="14px" fontWeight={400}>
            {t("DASHBOARD_ALL_BENEFITS_SUMMARY_DETAIL_ROW_DEADLINES")}
          </Text>
          <Text fontSize="12px" fontWeight={400}>
            Current Deadline:
            <Text as="span" display="block">
              {formatDate(detailData?.application_deadline)}
            </Text>
            <HStack spacing={2} alignItems="flex-start">
              <Text fontSize={"14px"} fontWeight="500px" color={"#0037B9"}>
                <Button
                  leftIcon={<SmallAddIcon />}
                  variant="link"
                  fontSize="14px"
                  fontWeight={500}
                  color="#0037B9"
                >
                  {" "}
                  {t(
                    "DASHBOARD_ALL_BENEFITS_SUMMARY_DETAIL_ROW_EXTEND_DEADLINES"
                  )}{" "}
                </Button>
              </Text>
            </HStack>
          </Text>
        </VStack>
      </VStack>
    </HStack>
  );
};
