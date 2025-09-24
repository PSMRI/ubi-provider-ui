import React from "react";
import { Box, Text, VStack, HStack, SimpleGrid } from "@chakra-ui/react";

// Field interface
interface Field {
  name: string;
  label: string;
  type?: string;
  options?: { label: string; value: string | number | boolean }[];
}

// Group interface for new format
interface FieldGroup {
  id: number;
  fieldsGroupName: string;
  fieldsGroupLabel: string;
  fields: Field[];
}

// Processed data interface
interface ProcessedGroup {
  groupLabel: string | null;
  data: TableRow[];
  groupId?: string;
}

// Table row interface
interface TableRow {
  col1Label: string;
  col1Value: string;
  col2Label?: string;
  col2Value?: string;
}

// Props interface for the component
interface ApplicationInfoProps {
  data: { [key: string]: any };
  mapping?: Field[] | FieldGroup[]; // Can be either flat or grouped
  columnsLayout?: "one" | "two";
}

const ApplicationInfo: React.FC<ApplicationInfoProps> = ({
  data,
  mapping,
  columnsLayout = "one",
}) => {
  // Helper: Converts camelCase to Title Case
  const camelToTitle = (str: string): string =>
    str.split(/(?=[A-Z])/).join(" ").replace(/^./, (char) => char.toUpperCase());

  // Helper: Get display value based on field type
  const getDisplayValue = (field: any, value: any): string => {
    if (!field) return value?.toString() ?? "N/A";
    if (field.type === "select" && Array.isArray(field.options)) {
      const option = field.options.find(
        (opt: { value: string }) => opt.value === value
      );
      return option?.label ?? value?.toString() ?? "N/A";
    }
    if (field.type === "amount" && value !== null && value !== "") {
      return `₹${Number(value).toFixed(2)}`;
    }
    return value?.toString() ?? "N/A";
  };

  // Helper: Check if mapping is grouped format
  const isGroupedFormat = (mapping: Field[] | FieldGroup[]): mapping is FieldGroup[] => {
    return mapping.length > 0 && 'fieldsGroupName' in mapping[0] && 'fields' in mapping[0];
  };

  // Helper: Create entry objects from data keys
  const createEntries = (keys: string[], fieldMap: { [key: string]: Field } = {}) => {
    return keys
      .filter((key) => Object.hasOwn(data, key))
      .map((key) => {
        const field = fieldMap[key];
        const label = field?.label ?? camelToTitle(key);
        const displayValue = getDisplayValue(field, data[key]);
        return { label, value: displayValue };
      });
  };

  // Helper: Format entries for table layout (one or two columns)
  const formatEntriesForTable = (entries: { label: string; value: string }[]): TableRow[] => {
    if (columnsLayout === "two") {
      return entries.reduce((rows: TableRow[], item, idx) => {
        if (idx % 2 === 0) {
          rows.push({ col1Label: item.label, col1Value: item.value });
        } else {
          const lastRow = rows[rows.length - 1];
          if (lastRow) {
            Object.assign(lastRow, {
            col2Label: item.label,
            col2Value: item.value,
            });
          }
        }
        return rows;
      }, []);
    }
    return entries.map((item): TableRow => ({
      col1Label: item.label,
      col1Value: item.value,
    }));
  };

  // Helper: Create table data for a group of fields
  const createTableData = (fields: Field[], fieldMap: { [key: string]: Field }): TableRow[] => {
    const keys = fields.map(f => f.name);
    const entries = createEntries(keys, fieldMap);
    return formatEntriesForTable(entries);
  };

  // Process mapping based on format
  const processedData = React.useMemo((): ProcessedGroup[] => {
    if (!mapping) {
      // No mapping provided, use all keys from data
      const keys = Object.keys(data);
      const entries = createEntries(keys);
      const formattedEntries = formatEntriesForTable(entries);
      return [{ groupLabel: null, data: formattedEntries, groupId: 'default' }];
    }

    if (isGroupedFormat(mapping)) {
      // New grouped format
      const allFields = mapping.flatMap(group => group.fields);
      const fieldMap = Object.fromEntries(allFields.map(field => [field.name, field]));

      return mapping.map(group => ({
        groupLabel: group.fieldsGroupLabel,
        data: createTableData(group.fields, fieldMap),
        groupId: group.fieldsGroupName
      }));
    } else {
      // Old flat format
      const fieldMap = Object.fromEntries(mapping.map(field => [field.name, field]));
      return [{
        groupLabel: null,
        data: createTableData(mapping, fieldMap),
        groupId: 'flat'
      }];
    }
  }, [data, mapping, columnsLayout]);

  // Render the label-value pairs
  return (
    <Box mt={4} width="100%">
      <VStack spacing={4} align="stretch">
        {processedData.map((group, index) => {
          const groupKey = group.groupId || `group-${index}`;
          return (
            <Box key={groupKey}>
              {group.groupLabel && (
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  mb={2}
                  color="blue.600"
                  borderBottom="2px solid"
                  borderColor="blue.200"
                  pb={2}
                >
                  {group.groupLabel}
                </Text>
              )}
              <SimpleGrid
                columns={columnsLayout === "two" ? 2 : 1}
                spacing={0}
                bg="transparent"
              >
                {group.data.map((row) => (
                  <React.Fragment key={`${row.col1Label}-${row.col1Value}`}>
                    <HStack spacing={0} align="stretch" width="100%">
                      <Box
                        width="50%"
                        border="1px"
                        borderColor="gray.200"
                        borderRight="none"
                        px={2}
                        py={1}
                        bg="gray.50"
                        display="flex"
                        alignItems="center"
                        height="auto"
                      >
                        <Text fontWeight="bold">
                          {row.col1Label}
                        </Text>
                      </Box>
                      <Box
                        flex="1"
                        border="1px"
                        borderColor="gray.200"
                        px={2}
                        py={1}
                        bg="white"
                        height="auto"
                        display="flex"
                        alignItems="center"
                      >
                        <Text>{row.col1Value}</Text>
                      </Box>
                    </HStack>
                    {columnsLayout === "two" && row.col2Label && (
                      <HStack spacing={0} align="stretch" width="100%">
                        <Box
                          width="50%"
                          border="1px"
                          borderColor="gray.200"
                          borderRight="none"
                          px={3}
                          py={2}
                          bg="gray.50"
                          display="flex"
                          alignItems="center"
                          height="auto"
                        >
                          <Text fontWeight="bold">
                            {row.col2Label}
                          </Text>
                        </Box>
                        <Box
                          flex="1"
                          border="1px"
                          borderColor="gray.200"
                          px={2}
                          py={1}
                          bg="white"
                          height="auto"
                          display="flex"
                          alignItems="center"
                        >
                          <Text>{row.col2Value}</Text>
                        </Box>
                      </HStack>
                    )}
                  </React.Fragment>
                ))}
              </SimpleGrid>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
};

export default ApplicationInfo;
