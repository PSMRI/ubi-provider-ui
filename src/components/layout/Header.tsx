import React from "react";
import {
  Box,
  HStack,
  InputRightElement,
  InputGroup,
  Menu,
  MenuButton,
  Input,
  IconButton,
  Select,
  Text,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Logo from "../../assets/Images/Logo.png";
import { useTranslation } from "react-i18next";
const Header: React.FC = () => {
  const { t } = useTranslation();
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
          <Text fontWeight="bold" fontSize="lg" color="#484848">
            {t("HEADER_COMPANY_NAME")}
          </Text>
        </HStack>

        {/* Right Section: Menu, Search Bar, and Language Dropdown */}
        <HStack align="center" gap={4}>
          {/* Menu 1 */}
          <Menu>
            <MenuButton as={Text} fontWeight="bold" cursor="pointer">
              About
            </MenuButton>
          </Menu>

          {/* Menu 2 */}
          <Menu>
            <MenuButton as={Text} fontWeight="bold" cursor="pointer">
              Contact Us
            </MenuButton>
          </Menu>

          {/* Search Bar */}
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

          {/* Language Dropdown */}
          <Select borderRadius="8" size="sm" width="100px">
            <option value="en">English</option>
          </Select>
        </HStack>
      </HStack>
    </Box>
  );
};
export default Header;
