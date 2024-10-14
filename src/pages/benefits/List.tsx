import { ChevronRightIcon, EditIcon, SearchIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { TT2, Tab, Table } from "@common";
import { DataType } from "ka-table/enums";
import { ICellTextProps } from "ka-table/props";
import React, { memo, useEffect, useState } from "react";
import benefits from "../../services/benefits";

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

const ActionCell = (prop: ICellTextProps) => {
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
      <TT2>
        {prop?.value
          ? new Date(prop.value).toLocaleString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : ""}
        <sup style={{ color: "blue" }}>+3</sup>
      </TT2>
    </HStack>
  );
};

const BenefitsList: React.FC<{ _vstack?: object }> = memo(({ _vstack }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const init = async () => {
      // Filtering data based on the selected tab (Active, Closed, Drafts)
      const tableData = await benefits.getAll();
      setData(
        const filteredTableData = tableData?.filter((item) => {
          switch (activeTab) {
            case 1:
              return item.status === "Active";
            case 2:
              return item.status === "Closed";
            default:
              return item.status === "Drafts";
          }
        });
        setData(filteredTableData);
      );
    };
    init();
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <VStack spacing="20px" align="stretch" {..._vstack}>
      <HStack justifyContent="space-between">
        <Tab
          activeIndex={activeTab}
          handleTabClick={handleTabClick}
          tabs={[{ label: "Active" }, { label: "Closed" }, { label: "Drafts" }]}
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
            content: (props) => {
              switch (props.column.key) {
                case "deadline":
                  return <DeadLineCell {...props} />;
                case "actions":
                  return <ActionCell {...props} />;
              }
            },
          },
        }}
      />
    </VStack>
  );
});

export default BenefitsList;
