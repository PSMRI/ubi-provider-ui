import { SearchIcon } from "@chakra-ui/icons";
import {
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { Tab, Table } from "@common";
import { DataType } from "ka-table/enums";
import React, { memo, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  { key: "actions", title: "Actions", dataType: DataType.String },
];

const BenefitsList: React.FC<{ _vstack?: object }> = memo(({ _vstack }) => {
  const [activeTab, setActiveTab] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    const init = async () => {
      // Filtering data based on the selected tab (Active, Closed, Drafts)
      const tableData = await benefits.getAll();
      setData(
        tableData?.filter((item) =>
          activeTab === 1
            ? item.status === "Active"
            : activeTab === 2
            ? item.status === "Closed"
            : item.status === "Drafts"
        )
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

        <InputGroup maxWidth="300px">
          <Input placeholder="Search" />
          <InputRightElement>
            <SearchIcon color="gray.500" />
          </InputRightElement>
        </InputGroup>
      </HStack>
      <Table columns={columns} data={data} />
    </VStack>
  );
});

export default BenefitsList;
