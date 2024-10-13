import React from "react";
import {
  AddIcon,
  EditIcon,
  SearchIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import {
  Box,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Logo from "../../assets/Images/Logo.png";
import TH1 from "../common/typography/TH1";
import TT2 from "../common/typography/TT2";

interface HeaderProps {
  showMenu?: boolean;
  showSearchBar?: boolean;
  showLanguage?: boolean;
}
const Header: React.FC<HeaderProps> = ({
  showMenu,
  showSearchBar,
  showLanguage,
}) => {
  const { t } = useTranslation();
  // Array of menu names
  const menuNames = [
    { label: "Dashboard" },
    {
      label: "Quick Actions",
      option: [
        { name: "Create", icon: <AddIcon /> },
        { name: "Edit", icon: <EditIcon /> },
      ],
    },
    { label: "Contact Us" },
  ];

  return (
    <Box
      w="100%"
      p={4}
      boxShadow="md"
      position="sticky"
      top={0}
      zIndex="11"
      bg="white"
    >
      <HStack align="center" justify="space-between" flex="1">
        {/* Left Section: Logo and Company Name */}
        <HStack align="center">
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "40px", marginRight: "8px" }}
          />
          <TH1 color="#484848">{t("HEADER_COMPANY_NAME")}</TH1>
        </HStack>

        {/* Right Section: Menu, Search Bar, and Language Dropdown */}
        <HStack align="center" spacing={10}>
          {/* Menu 1 */}
          {showMenu &&
            menuNames.map((menu, index) => (
              <HStack key={menu?.label || index} align="center">
                {menu?.option ? (
                  <Menu>
                    <MenuButton as={Text} fontWeight="bold" cursor="pointer">
                      <HStack align="center" spasing="2">
                        <TT2>{menu?.label}</TT2>
                        <ChevronDownIcon />
                      </HStack>
                    </MenuButton>
                    <MenuList>
                      {menu?.option.map((submenuItem, subIndex) => (
                        <MenuItem
                          key={subIndex}
                          icon={submenuItem.icon}
                          onHover={{ border: "0" }}
                        >
                          {submenuItem.name}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                ) : (
                  <TT2 cursor="pointer">{menu?.label}</TT2>
                )}
              </HStack>
            ))}

          {/* Search Bar */}
          {showSearchBar && (
            <HStack align="center">
              <InputGroup maxWidth="300px" rounded={"full"} size="lg">
                <Input
                  placeholder="Search For Benefit"
                  rounded={"full"}
                  bg="#E9E7EF"
                />
                <InputRightElement>
                  <SearchIcon color="gray.500" />
                </InputRightElement>
              </InputGroup>
            </HStack>
          )}
          {/* Language Dropdown */}
          {showLanguage && (
            <Select borderRadius="8" size="sm" width="100px">
              <option value="en">English</option>
            </Select>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};
export default Header;
