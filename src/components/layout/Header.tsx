import React from "react";
import {
  Box,
  HStack,
  Stack,
  Select,
  Text,
  InputRightElement,
  InputGroup,
  Menu,
  MenuButton,
  Input,
  IconButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import Logo from "../../assets/Images/Logo.png";
import { SearchIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";
import TH1 from "../common/typography/TH1";
import TT2 from "../common/typography/TT2";

import { AddIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
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
  const menuNames = ["Dashboard", "About", "Quick Actions", "Contact Us"];

  // Submenu for the 'Quick Actions' menu item
  const quickActionsSubmenu = [
    { name: "Create", icon: <AddIcon /> },
    { name: "Edit", icon: <EditIcon /> },
    { name: "Reports", icon: <ViewIcon /> },
  ];
  return (
    <Box
      w="100%"
      p={4}
      boxShadow="md"
      position="fixed"
      top={0}
      right="0"
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
        <HStack align="center" gap={2}>
          {/* Menu 1 */}
          {showMenu &&
            menuNames.map((menuName, index) => (
              <Menu key={index}>
                <MenuButton
                  as={Text}
                  fontWeight="bold"
                  cursor="pointer"
                  marginRight="20px"
                >
                  <TT2>{menuName}</TT2>
                </MenuButton>
                <MenuList>
                  {menuName === "Quick Actions" ? (
                    quickActionsSubmenu.map((submenuItem, subIndex) => (
                      <MenuItem key={subIndex} icon={submenuItem.icon}>
                        {submenuItem.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem>
                      <TT2>{menuName}</TT2>
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>
            ))}

          {/* Search Bar */}
          {showSearchBar && (
            <HStack align="center">
              <InputGroup>
                {/* Input Field */}
                <Input borderRadius="50" placeholder="Search..." />

                {/* Icon Button inside Input */}
                <InputRightElement>
                  <IconButton
                    borderRadius="50"
                    aria-label="Search"
                    icon={<SearchIcon />}
                    size="sm"
                    onClick={() => console.log("Search clicked")}
                  />
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
