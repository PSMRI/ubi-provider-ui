import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useToast,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { saveAs } from "file-saver";
import { exportApplicationsCsv } from "../services/benefits";

interface DownloadCSVProps {
  benefitId: string;
  benefitName: string;
  selectedStatus?: string;
  isDisabled?: boolean;
}

const options = [
  { label: "Disbursement Bank Details", value: "sbiToOtherBanks" },
  { label: "Application Data", value: "allApplicationDataFields" },
  { label: "Benefit Amount Calculation", value: "benefit_amounts" },
];

const DownloadCSV: React.FC<DownloadCSVProps> = ({
  benefitId,
  benefitName,
  selectedStatus = "",
  isDisabled = false,
}) => {
  const [loadingOption, setLoadingOption] = useState<string | null>(null);
  const toast = useToast();

  const handleDownload = async (selectedOption: string) => {
    setLoadingOption(selectedOption);
    try {
      const data = await exportApplicationsCsv({
        benefitId,
        type: selectedOption,
        status: selectedStatus || undefined,
      });

      // If data is a Blob or Response, convert to text
      let csvString: string;
      if (data instanceof Blob) {
        csvString = await data.text();
      } else if (typeof data === "object" && typeof data.text === "function") {
        csvString = await data.text();
      } else {
        csvString = data;
      }

      // Sanitize file name for Windows
      const sanitizeFileName = (name: string) =>
        name.replace(/[\\/:*?"<>|]/g, "_");
      const safeBenefitName = sanitizeFileName(benefitName);
      const safeOption = sanitizeFileName(selectedOption);
      const fileName = `${safeBenefitName}-${safeOption}.csv`;

      // Add UTF-8 BOM for Excel compatibility
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvString], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, fileName);

      toast({
        title: "CSV downloaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error downloading CSV:", err);
      toast({
        title: "Failed to download CSV",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoadingOption(null);
    }
  };

  return (
    <Box>
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              {...({
                as: Button,
                rightIcon: <ChevronDownIcon />,
                colorScheme: "blue",
                width: "200px",
                isActive: isOpen,
                isDisabled,
              } as any)}
            >
              Download Data
            </MenuButton>

            <MenuList minW="200px" zIndex={100}>
              {options.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => handleDownload(option.value)}
                >
                  <Flex align="center" gap={2}>
                    {loadingOption === option.value ? (
                      <Spinner size="sm" />
                    ) : null}
                    {option.label}
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default DownloadCSV;
