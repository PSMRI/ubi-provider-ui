import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  HStack,
  Box,
  Button,
  IconButton,
  Stack,
  Text,
  TabIndicator,
  VStack,
} from "@chakra-ui/react";
import { ChevronRightIcon, EditIcon } from "@chakra-ui/icons";
import { tableData, tableHeader } from "../../utils/dataJSON/BenefitSummary";
import BenefitsList from "../benefits/List";
import { useTranslation } from "react-i18next";
import { TD2 } from "@common";

const BenefitSummary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Active");
  const [filteredData, setFilteredData] = useState(tableData);
  const { t } = useTranslation();

  const rowsPerPage = 10;

  // Filter data based on active tab and search term
  useEffect(() => {
    const filtered = tableData.filter(
      (item) =>
        item?.status === activeTab &&
        item?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [activeTab, searchTerm]);

  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const displayedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);
  const onChangeTab = (index: number) => {
    if (index === 0) {
      setActiveTab("Active");
    } else if (index === 1) {
      setActiveTab("Closed");
    } else {
      setActiveTab("Drafts");
    }
  };
  return (
    <VStack spacing="60px" align="stretch" boxShadow="md">
      <TD2 color={"#2F3036"} px="170px">
        {t("DASHBOARD_ALL_BENEFITS_SUMMARY")}
      </TD2>
      {/* Tabs for Active, Closed, and Drafts */}

      <BenefitsList _vstack={{ px: "20px" }} />
    </VStack>
  );
};

export default BenefitSummary;
