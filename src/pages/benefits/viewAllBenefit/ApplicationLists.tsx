import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  Select,
  VStack,
  Text,
  Flex,
} from "@chakra-ui/react";
import Table from "../../../components/common/table/Table";
import { DataType } from "ka-table/enums";
import { ICellTextProps } from "ka-table/props";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import PaginationList from "./PaginationList";
import {
  fetchApplicationsList,
  SortByOption,
  SortDirection,
  ApplicationListItem,
  ApplicationsListResponse,
} from "../../../services/benefits";
import DownloadCSV from "../../../components/DownloadCSV";
import { formatDate } from "../../../services/helperService";

const DetailsButton = ({ rowData }: ICellTextProps) => {
  const navigate = useNavigate();
  return (
    <Flex justifyContent="center" alignItems="center" width="100%">
      <IconButton
        aria-label="View"
        icon={<ArrowForwardIcon />}
        size="lg"
        onClick={() => {
          navigate(`/application_detail/${rowData?.applicationId}`);
        }}
      />
    </Flex>
  );
};

type AppRow = {
  studentName: string;
  applicationId: string;
  orderId: string;
  submittedAt: Date | null;
  lastUpdatedAt: Date | null;
  status: string;
  submittedAtDisplay: string;
  lastUpdatedAtDisplay: string;
};

const ApplicationLists: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [applicationData, setApplicationData] = useState<AppRow[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;
  const [benefitName, setBenefitName] = useState<string>("");
  const [totalApplications, setTotalApplications] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    orderBy: "updatedAt" as SortByOption,
    orderDirection: "desc" as SortDirection,
  });
  const navigate = useNavigate();

  const columns = [
    {
      key: "studentName",
      title: "Name",
      dataType: DataType.String,
      isSortEnabled: false,
      style: {
        width: "15%",
        minWidth: 80,
        whiteSpace: "nowrap",
      },
    },
    {
      key: "applicationId",
      title: "App ID",
      dataType: DataType.Number,
      isSortEnabled: false,
      style: {
        width: "5%",
        minWidth: 10,
        whiteSpace: "nowrap",
        textAlign: "center",
      },
    },
    {
      key: "orderId",
      title: "Order ID",
      dataType: DataType.String,
      isSortEnabled: false,
      style: {
        width: "15%",
        minWidth: 80,
        whiteSpace: "nowrap",
        textAlign: "center",
        color: "#666",
      },
    },
    {
      key: "submittedAt",
      title: "Submitted At",
      dataType: DataType.Date,
      isSortEnabled: false,
      style: {
        width: "10%",
        minWidth: 50,
        whiteSpace: "nowrap",
        textAlign: "center",
      },
    },
    {
      key: "lastUpdatedAt",
      title: "Last Updated At",
      dataType: DataType.Date,
      isSortEnabled: false,
      style: {
        width: "10%",
        minWidth: 50,
        whiteSpace: "nowrap",
        textAlign: "center",
      },
    },
    {
      key: "status",
      title: "Status",
      dataType: DataType.String,
      isSortEnabled: false,
      style: {
        width: "10%",
        minWidth: 30,
        whiteSpace: "nowrap",
        textAlign: "center",
      },
    },
    {
      key: "actions",
      title: "Actions",
      dataType: DataType.String,
      isSortEnabled: false,
      style: {
        width: "10%",
        minWidth: 30,
        whiteSpace: "nowrap",
        textAlign: "center",
        color: "#666",
      },
    },
  ];

  useEffect(() => {
    const fetchApplicationData = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const payload = {
            benefitId: id,
            limit: pageSize,
            offset: pageIndex * pageSize,
            orderBy: sortConfig.orderBy,
            orderDirection: sortConfig.orderDirection,
          };

          const response = (await fetchApplicationsList(
            payload
          )) as ApplicationsListResponse;
          if (import.meta.env.DEV) {
            console.debug("applicationsResponse", response);
          }

          setBenefitName(response?.benefit?.title ?? "");
          setTotalApplications(response?.pagination?.total ?? 0);

          if (
            !response?.applications ||
            !Array.isArray(response?.applications)
          ) {
            console.error("Invalid response format from API");
            setApplicationData([]);
            return;
          }

          const processedData: AppRow[] = response.applications.map(
            (item: ApplicationListItem) => {
              const { firstName, middleName, lastName } =
                item.applicationData || {};
              const nameParts = [firstName, middleName, lastName].filter(
                Boolean
              );
              const studentName =
                nameParts.length > 0 ? nameParts.join(" ") : "N/A";

              return {
                studentName,
                applicationId: item?.id ?? "-",
                orderId: item?.orderId ?? "-",
                submittedAt: item?.createdAt ? new Date(item.createdAt) : null,
                lastUpdatedAt: item?.updatedAt
                  ? new Date(item.updatedAt)
                  : null,
                status: item?.status ?? "-",
                // Store original date strings for display
                submittedAtDisplay: item?.createdAt ?? "-",
                lastUpdatedAtDisplay: item?.updatedAt ?? "-",
              };
            }
          );

          setApplicationData(processedData);
        } catch (error) {
          console.error(error);
          setApplicationData([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("id is undefined");
        setIsLoading(false);
      }
    };
    fetchApplicationData();
  }, [id, pageIndex, sortConfig]);

  const handleSortChange = (
    orderBy: SortByOption,
    orderDirection: SortDirection
  ) => {
    setSortConfig({ orderBy, orderDirection });
    setPageIndex(0);
  };

  // Use all application data since we removed client-side search
  const filteredData = applicationData || [];

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  return (
    <Layout
      _titleBar={{
        title: (
          <HStack spacing={4}>
            <ArrowBackIcon
              w={6}
              h={6}
              cursor="pointer"
              onClick={() => navigate(-1)}
              color="white"
              fontWeight="bold"
            />
            <Text fontWeight="bold">Application List For: {benefitName}</Text>
          </HStack>
        ),
      }}
      showMenu={true}
      showSearchBar={true}
      showLanguage={false}
    >
      <VStack spacing="50px" p={"20px"} align="stretch">
        {/* Controls - Only show when not loading and data is available */}
        {!isLoading && filteredData.length > 0 && (
          <HStack justify="space-between" align="center" spacing={4}>
            <HStack spacing={4} align="center">
              <Select
                value={sortConfig.orderBy}
                onChange={(e) =>
                  handleSortChange(
                    e.target.value as SortByOption,
                    sortConfig.orderDirection
                  )
                }
                width="180px"
                bg="white"
              >
                <option value="" disabled>
                  Order By
                </option>
                <option value="id">App ID</option>
                <option value="createdAt">Submitted At</option>
                <option value="updatedAt">Last Updated At</option>
              </Select>

              <Select
                value={sortConfig.orderDirection}
                onChange={(e) =>
                  handleSortChange(
                    sortConfig.orderBy,
                    e.target.value as SortDirection
                  )
                }
                width="150px"
                bg="white"
              >
                <option value="" disabled>
                  Sort Order
                </option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </Select>
            </HStack>
            {id && <DownloadCSV benefitId={id} benefitName={benefitName} />}
          </HStack>
        )}

        {/* Table and Pagination */}
        {(() => {
          if (isLoading) {
            return (
              <Text fontSize="lg" textAlign="center" color="blue.500">
                Loading...
              </Text>
            );
          } else if (filteredData?.length > 0) {
            return (
              <Table
                columns={columns}
                data={filteredData}
                rowKeyField={"applicationId"}
                childComponents={{
                  cellText: {
                    content: (props: ICellTextProps) => CellTextContent(props),
                  },
                }}
              />
            );
          } else {
            return (
              <Text fontSize="lg" textAlign="center" color="gray.500">
                No applications available
              </Text>
            );
          }
        })()}

        {!isLoading && totalApplications > 0 && (
          <PaginationList
            total={totalApplications}
            pageSize={pageSize}
            currentPage={pageIndex}
            onPageChange={handlePageChange}
          />
        )}
      </VStack>
    </Layout>
  );
};

export default ApplicationLists;

const CellTextContent = (props: ICellTextProps) => {
  if (props.column.key === "actions") {
    return <DetailsButton {...props} />;
  }

  if (props.column.key === "status") {
    const status = props.value?.toLowerCase();
    let color = "gray.500";
    if (status === "pending") color = "orange.500";
    else if (status === "approved") color = "green.500";
    else if (status === "rejected") color = "red.500";
    const titleCaseStatus = status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "";
    return (
      <Text color={color} fontWeight="bold">
        {titleCaseStatus}
      </Text>
    );
  }

  if (
    props.column.key === "submittedAt" ||
    props.column.key === "lastUpdatedAt"
  ) {
    const displayValue =
      props.column.key === "submittedAt"
        ? props.rowData?.submittedAtDisplay
        : props.rowData?.lastUpdatedAtDisplay;

    if (!displayValue || displayValue === "-") {
      return <Text>-</Text>;
    }
    return (
      <Text
        isTruncated
        whiteSpace="nowrap"
        title={formatDate(displayValue, { withTime: true })}
      >
        {formatDate(displayValue)}
      </Text>
    );
  }

  return props.value;
};
