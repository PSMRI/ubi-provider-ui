import "ka-table/style.css";

import React from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Table } from "ka-table";
import { DataType, EditingMode, SortingMode } from "ka-table/enums";
import { tableData } from "../../../utils/dataJSON/BenefitSummary";

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
  { key: "actions", title: "Actions", dataType: DataType.String },
];

const CommonTable = () => {
  const [activeTab, setActiveTab] = React.useState("Active");
  // Filtering data based on the selected tab (Active, Closed, Drafts)
  const filteredData = tableData?.filter((item) => item.status === activeTab);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <VStack spacing="20px" align="stretch">
      <HStack justifyContent="space-between">
        <HStack spacing="15px" className="tabs">
          <Button
            variant={activeTab === "Active" ? "solid" : "outline"}
            onClick={() => handleTabClick("Active")}
          >
            Active
          </Button>
          <Button
            variant={activeTab === "Closed" ? "solid" : "outline"}
            onClick={() => handleTabClick("Closed")}
          >
            Closed
          </Button>
          <Button
            variant={activeTab === "Drafts" ? "solid" : "outline"}
            onClick={() => handleTabClick("Drafts")}
          >
            Drafts
          </Button>
        </HStack>
        <InputGroup maxWidth="300px">
          <Input placeholder="Search" />
          <InputRightElement children={<SearchIcon color="gray.500" />} />
        </InputGroup>
      </HStack>
      <Table
        columns={columns}
        data={filteredData}
        editingMode={EditingMode.Cell}
        rowKeyField={"name"}
        sortingMode={SortingMode.Single}
      />
    </VStack>
  );
};

export default CommonTable;
