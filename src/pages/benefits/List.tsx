import React, { memo, useState, useEffect } from "react";
import {
  VStack,
  HStack,
  Button,
  InputGroup,
  Input,
  InputRightElement,
} from "@chakra-ui/react";
import { Table, TD2 } from "@common";
import benefits from "../../services/benefits";
import { DataType, EditingMode, SortingMode } from "ka-table/enums";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@chakra-ui/icons";

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

const BenefitsList: React.FC = memo(() => {
  const [activeTab, setActiveTab] = useState("Active");
  const [data, setData] = useState("Active");
  const { t } = useTranslation();

  useEffect(() => {
    const init = async () => {
      // Filtering data based on the selected tab (Active, Closed, Drafts)
      const tableData = await benefits.getAll();
      console.log(tableData);
      setData(tableData?.filter((item) => item.status === activeTab));
    };
    init();
  }, []);
  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <VStack spacing="60px" align="stretch">
      <TD2 color={"#2F3036"} px="170px">
        {t("DASHBOARD_ALL_BENEFITS_SUMMARY")}
      </TD2>
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
        <Table columns={columns} data={data} />
      </VStack>
    </VStack>
  );
});

export default BenefitsList;
