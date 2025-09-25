import React from "react";
import { Table, DataType } from "ka-table";
import { Box, Text, VStack } from "@chakra-ui/react";
import "ka-table/style.css";

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
      .filter((key) => Object.prototype.hasOwnProperty.call(data, key))
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
        const lastRow = rows.at(-1);
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

  // Define table columns based on layout
  const getColumns = () => {
    const baseColumns = [
      {
        key: "col1Label",
        title: "Field",
        dataType: DataType.String,
        style: { fontWeight: "bold", width: "25%" },
      },
      {
        key: "col1Value",
        title: "Value",
        dataType: DataType.String,
        style: { width: "25%" },
      },
    ];

    if (columnsLayout === "two") {
      return [
        ...baseColumns,
        {
          key: "col2Label",
          title: "Field",
          dataType: DataType.String,
          style: { fontWeight: "bold", width: "25%" },
        },
        {
          key: "col2Value",
          title: "Value",
          dataType: DataType.String,
          style: { width: "25%" },
        },
      ];
    }

    return baseColumns;
  };

  const columns = getColumns();

  // Render the table with custom styles
  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}
    >
      <div style={{ width: columnsLayout === "two" ? "100%" : "50%" }}>

        <VStack spacing={6} align="stretch">
          {processedData.map((group, index) => {
            const groupKey = group.groupId || `group-${index}`;
            return (
              <Box key={groupKey}>
                {group.groupLabel && (
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    mb={4}
                    color="blue.600"
                    borderBottom="2px solid"
                    borderColor="blue.200"
                    pb={2}
                  >
                    {group.groupLabel}
                  </Text>
                )}
                <Table
                  rowKeyField="col1Label"
                  data={group.data}
                  columns={columns}
                  childComponents={{
                    table: {
                      elementAttributes: () => ({
                        style: { width: "100%", borderCollapse: "collapse" },
                      }),
                    },
                  }}
                />
              </Box>
            );
          })}
        </VStack>

        {/* Inline styles for table header and cells */}
        <style>
          {`
            .ka-thead {
              display: none; /* Hides the header row */
            }
            .ka-cell {
              padding: 8px;
              text-align: left !important;
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default ApplicationInfo;
