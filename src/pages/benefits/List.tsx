import { ChevronRightIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import {
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
const ActionCell = () => {
  return (
    <HStack>
      <IconButton aria-label="Edit" icon={<EditIcon />} size="lg" />
      <IconButton
        aria-label="Go to details"
        icon={<ChevronRightIcon />}
        size="lg"
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
  useEffect(() => {
    const init = async () => {
      // Filtering data based on the selected tab (Active, Closed, Drafts)
      const filteredTableData = benefitData?.benefit_summary?.filter((item) => {
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
      });
      setData(filteredTableData as any);
    };
    init();
  }, [activeTab, benefitData]);

  const handleTabClick = (tab: string) => {
    setActiveTab(parseInt(tab, 10));
  };

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
        data={data}
        childComponents={{
          cellText: {
            content: CustomCellText,
          },
        }}
      />
    </VStack>
  );
});

export default BenefitsList;

const CustomCellText = (props: ICellTextProps) => {
  switch (props.column.key) {
    case "deadline":
      return <DeadLineCell {...props} />;
    case "actions":
      return <ActionCell {...(props as any)} />;
  }
};
