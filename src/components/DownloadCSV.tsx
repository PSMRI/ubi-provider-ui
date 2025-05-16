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
}

const DownloadCSV: React.FC<DownloadCSVProps> = ({
  benefitId,
  benefitName,
}) => {
  const [loadingOption, setLoadingOption] = useState<string | null>(null);
  const toast = useToast();
  const rawOptions = import.meta.env.VITE_APP_CSV_OPTIONS || "[]";

  let options;
  try {
    options = JSON.parse(rawOptions);
  } catch (e) {
    options = [];
    console.error("Invalid CSV options JSON in env", e);
  }

  const handleDownload = async (selectedOption: string) => {
    setLoadingOption(selectedOption);
    try {
      const data = await exportApplicationsCsv({
        benefitId,
        type: selectedOption,
      });

      const blob = new Blob([data], {
        type: "text/csv;charset=utf-8;",
      });
      saveAs(blob, `${benefitName}-${selectedOption}.csv`);

      toast({
        title: "CSV downloaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
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
              } as any)}
            >
              Download CSV
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
