import React from "react";
import {
  Box,
  VStack,
  Text,
  Flex,
  Badge,
  useColorModeValue,
  Circle,
} from "@chakra-ui/react";
import {
  CheckIcon,
  CloseIcon,
  RepeatIcon,
  TimeIcon,
  EditIcon,
} from "@chakra-ui/icons";

// TypeScript interfaces
interface ActionLogEntry {
  os?: string;
  browser?: string;
  updatedBy?: number;
  ip?: string;
  updatedAt: string;
  status: string;
  remark?: string;
}

interface ApplicationActionLogProps {
  applicationData: {
    actionLog: string[];
    createdAt: string;
    status?: string;
    [key: string]: any;
  };
}

const ApplicationActionLog: React.FC<ApplicationActionLogProps> = ({
  applicationData,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Helper function to get icon for status
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckIcon color="green.500" />;
      case "rejected":
        return <CloseIcon color="red.500" />;
      case "resubmit":
        return <RepeatIcon color="orange.500" />;
      case "pending":
      case "application submitted":
        return <EditIcon color="blue.500" />;
      default:
        return <TimeIcon color="gray.500" />;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "approved":
        return "green";
      case "rejected":
        return "red";
      case "resubmit":
        return "orange";
      case "pending":
      case "application submitted":
        return "blue";
      default:
        return "gray";
    }
  };

  // Helper function to get status display text
  const getStatusDisplayText = (status: string): string => {
    switch (status.toLowerCase()) {
      case "resubmit":
        return "Asked for resubmit";
      case "pending":
        return "Submitted";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Parse action log entries
  const parseActionLogEntries = (): ActionLogEntry[] => {
    if (
      !applicationData.actionLog ||
      !Array.isArray(applicationData.actionLog)
    ) {
      return [];
    }

    return applicationData.actionLog
      .map((logEntry: string) => {
        try {
          return JSON.parse(logEntry) as ActionLogEntry;
        } catch (error) {
          console.error("Error parsing action log entry:", error);
          return null;
        }
      })
      .filter((entry): entry is ActionLogEntry => entry !== null)
      .sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
  };

  // Create timeline items
  const createTimelineItems = () => {
    const items = [];
    const actionLogEntries = parseActionLogEntries();

    // First item: Application submission
    if (applicationData.createdAt) {
      items.push({
        date: applicationData.createdAt,
        status: "Application Submitted",
        remark: "Application was submitted for review",
        isFirst: true,
      });
    }

    // Add action log entries

    actionLogEntries.forEach((entry) => {
      const reviewerComment =
        entry.remark || `Application status changed to ${entry.status}`;
      items.push({
        date: entry.updatedAt,
        status: entry.status,
        remark: `Reviewer Comment: "${reviewerComment}"`,
        isFirst: false,
      });
    });

    return items;
  };

  const timelineItems = createTimelineItems();

  if (timelineItems.length === 0) {
    return (
      <Box
        p={6}
        textAlign="center"
        border="2px dashed"
        borderColor="gray.300"
        borderRadius="lg"
        bg="gray.50"
      >
        <Text fontSize="lg" color="gray.500">
          No action history available
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg={bgColor}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      p={6}
    >
      <Box position="relative" width="100%">
        {/* Central vertical line */}
        <Box
          position="absolute"
          left="50%"
          top="0"
          bottom="0"
          width="2px"
          bg="gray.300"
          transform="translateX(-50%)"
          zIndex={1}
        />

        <VStack align="stretch" spacing={8}>
          {timelineItems.map((item, index) => {
            const isLeft = index % 2 === 0;
            const uniqueKey = `${item.date}-${item.status}`;

            return (
              <Box key={uniqueKey} position="relative" width="100%">
                <Flex
                  justify="center"
                  align="center"
                  position="relative"
                  minHeight="80px"
                >
                  {/* Left side content */}
                  {isLeft && (
                    <Box width="45%" pr={8} textAlign="right">
                      <Flex justify="flex-end" mb={2}>
                        <Badge
                          colorScheme={getStatusColor(item.status)}
                          variant="solid"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          {getStatusDisplayText(item.status)}
                        </Badge>
                      </Flex>

                      <Text fontSize="sm" color="gray.600" mb={1}>
                        {formatDate(item.date)}
                      </Text>

                      {item.remark && (
                        <Text fontSize="sm" color="gray.700" fontStyle="italic">
                          "{item.remark}"
                        </Text>
                      )}
                    </Box>
                  )}

                  {/* Empty space for right-aligned items */}
                  {!isLeft && <Box width="45%" />}

                  {/* Central icon */}
                  <Box
                    position="absolute"
                    left="50%"
                    transform="translateX(-50%)"
                    zIndex={2}
                  >
                    <Circle
                      size="40px"
                      bg="white"
                      border="2px solid"
                      borderColor="gray.300"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {getStatusIcon(item.status)}
                    </Circle>
                  </Box>

                  {/* Empty space for left-aligned items */}
                  {isLeft && <Box width="45%" />}

                  {/* Right side content */}
                  {!isLeft && (
                    <Box width="45%" pl={8} textAlign="left">
                      <Flex justify="flex-start" mb={2}>
                        <Badge
                          colorScheme={getStatusColor(item.status)}
                          variant="solid"
                          borderRadius="full"
                          px={3}
                          py={1}
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          {getStatusDisplayText(item.status)}
                        </Badge>
                      </Flex>

                      <Text fontSize="sm" color="gray.600" mb={1}>
                        {formatDate(item.date)}
                      </Text>

                      {item.remark && (
                        <Text fontSize="sm" color="gray.700" fontStyle="italic">
                          {item.remark}
                        </Text>
                      )}
                    </Box>
                  )}
                </Flex>
              </Box>
            );
          })}
        </VStack>
      </Box>
    </Box>
  );
};

export default ApplicationActionLog;
