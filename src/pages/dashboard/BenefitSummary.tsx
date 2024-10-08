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
} from "@chakra-ui/react";
import { ChevronRightIcon, EditIcon } from "@chakra-ui/icons";
import { tableData, tableHeader } from "../../utils/dataJSON/BenefitSummary";

const BenefitSummary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("Active");
  const [filteredData, setFilteredData] = useState(tableData);

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
    <Box p={6}>
      {/* Tabs for Active, Closed, and Drafts */}
      <Tabs
        position="relative"
        variant="unstyled"
        onChange={(index) => onChangeTab(index)}
      >
        <TabList>
          <Tab
            pb={2}
            _hover={{ outline: "none", borderColor: "white" }} // Change underline color on hover
            _focus={{ outline: "none", borderColor: "blue.500" }} // Remove focus outline and change border color
          >
            <HStack spacing={2}>
              <Box
                w={2}
                h={2}
                borderRadius="full"
                bg="#30713D" // Circle color
              />
              <Text>Active</Text>
            </HStack>
          </Tab>
          <Tab
            pb={2}
            _hover={{ outline: "none", borderColor: "white" }} // Change underline color on hover
            _focus={{ outline: "none", borderColor: "blue.500" }}
          >
            Closed
          </Tab>
          <Tab
            pb={2}
            _hover={{ outline: "none", borderColor: "white" }} // Change underline color on hover
            _focus={{ outline: "none", borderColor: "blue.500" }}
          >
            Drafts
          </Tab>
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
        <TabPanels>
          {/* Table Panel */}
          <TabPanel>
            {/* Search Bar */}
            <HStack justify="space-between" mb={4}>
              <Box>
                <Text fontSize="lg">{activeTab} Data</Text>
              </Box>
              <Input
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width="200px"
              />
            </HStack>

            {/* Table */}
            <Table variant="simple">
              <Thead backgroundColor={"#0000001A"}>
                <Tr>
                  {tableHeader?.map((head, idx) => {
                    return <Th key={head.id}>{head.label}</Th>;
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {displayedData.map((row, index) => (
                  <Tr key={row.id}>
                    {/* <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td> */}
                    <Td>{row.name}</Td>
                    <Td>{row.applicants}</Td>
                    <Td>{row.approved}</Td>
                    <Td>{row.rejected}</Td>
                    <Td>{row.disbursal}</Td>
                    <Td>{row.deadline}</Td>

                    <Td>
                      <HStack>
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          size="sm"
                        />
                        <IconButton
                          aria-label="Go to details"
                          icon={<ChevronRightIcon />}
                          size="sm"
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* Pagination */}
            <Stack
              direction="row"
              justify="space-between"
              align="center"
              mt={4}
            >
              <Box>
                Showing {Math.min(currentPage * rowsPerPage, totalRows)} out of{" "}
                {totalRows}
              </Box>
              <HStack spacing={2}>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                    size="sm"
                  >
                    {index + 1}
                  </Button>
                ))}
              </HStack>
            </Stack>
          </TabPanel>

          {/* Closed and Drafts panels (reused table structure, different filters applied) */}
          <TabPanel>
            {/* Search Bar */}
            <HStack justify="space-between" mb={4}>
              <Box>
                <Text fontSize="lg">{activeTab} Data</Text>
              </Box>
              <Input
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width="200px"
              />
            </HStack>

            {/* Table */}
            <Table variant="simple">
              <Thead backgroundColor={"#0000001A"}>
                <Tr>
                  {tableHeader?.map((head, idx) => {
                    return <Th key={head.id}>{head.label}</Th>;
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {displayedData.map((row, index) => (
                  <Tr key={row.id}>
                    {/* <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td> */}
                    <Td>{row.name}</Td>
                    <Td>{row.applicants}</Td>
                    <Td>{row.approved}</Td>
                    <Td>{row.rejected}</Td>
                    <Td>{row.disbursal}</Td>
                    <Td>{row.deadline}</Td>

                    <Td>
                      <HStack>
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          size="sm"
                        />
                        <IconButton
                          aria-label="Go to details"
                          icon={<ChevronRightIcon />}
                          size="sm"
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* Pagination */}
            <Stack
              direction="row"
              justify="space-between"
              align="center"
              mt={4}
            >
              <Box>
                Showing {Math.min(currentPage * rowsPerPage, totalRows)} out of{" "}
                {totalRows}
              </Box>
              <HStack spacing={2}>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                    size="sm"
                  >
                    {index + 1}
                  </Button>
                ))}
              </HStack>
            </Stack>
          </TabPanel>
          <TabPanel>
            {/* Search Bar */}
            <HStack justify="space-between" mb={4}>
              <Box>
                <Text fontSize="lg">{activeTab} Data</Text>
              </Box>
              <Input
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                width="200px"
              />
            </HStack>

            {/* Table */}
            <Table variant="simple">
              <Thead backgroundColor={"#0000001A"}>
                <Tr>
                  {tableHeader?.map((head, idx) => {
                    return <Th key={head.id}>{head.label}</Th>;
                  })}
                </Tr>
              </Thead>
              <Tbody>
                {displayedData.map((row, index) => (
                  <Tr key={row.id}>
                    {/* <Td>{(currentPage - 1) * rowsPerPage + index + 1}</Td> */}
                    <Td>{row.name}</Td>
                    <Td>{row.applicants}</Td>
                    <Td>{row.approved}</Td>
                    <Td>{row.rejected}</Td>
                    <Td>{row.disbursal}</Td>
                    <Td>{row.deadline}</Td>

                    <Td>
                      <HStack>
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          size="sm"
                        />
                        <IconButton
                          aria-label="Go to details"
                          icon={<ChevronRightIcon />}
                          size="sm"
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            {/* Pagination */}
            <Stack
              direction="row"
              justify="space-between"
              align="center"
              mt={4}
            >
              <Box>
                Showing {Math.min(currentPage * rowsPerPage, totalRows)} out of{" "}
                {totalRows}
              </Box>
              <HStack spacing={2}>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                    size="sm"
                  >
                    {index + 1}
                  </Button>
                ))}
              </HStack>
            </Stack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default BenefitSummary;
