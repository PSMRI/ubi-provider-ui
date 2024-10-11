import "ka-table/style.css";

import React from "react";

import { Table } from "ka-table";
import { DataType, EditingMode, SortingMode } from "ka-table/enums";
import { tableData } from "../../../utils/dataJSON/BenefitSummary";
import { Box } from "@chakra-ui/react";

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
    <Box>
      <div className="tabs">
        <button onClick={() => handleTabClick("Active")}>Active</button>
        <button onClick={() => handleTabClick("Closed")}>Closed</button>
        <button onClick={() => handleTabClick("Drafts")}>Drafts</button>
      </div>
      <Table
        columns={columns}
        data={filteredData}
        editingMode={EditingMode.Cell}
        rowKeyField={"id"}
        sortingMode={SortingMode.Single}
      />
    </Box>
  );
};

export default CommonTable;
