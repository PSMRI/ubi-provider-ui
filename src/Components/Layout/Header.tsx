import React from "react";
import {
  Box,
  Flex,
  InputRightElement,
  InputGroup,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
    <Box w="100%" p={4} boxShadow="md" position="fixed" top={0}>
      <Flex align="center" justify="space-between" mx="auto">
        {/* Left Section: Logo and Company Name */}
        <Flex align="center">
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "40px", marginRight: "8px" }}
          />
          <Text fontWeight="bold" fontSize="lg" color="#484848">
            {t("HEADER_COMPANY_NAME")}
          </Text>
        </Flex>

        {/* Right Section: Menu, Search Bar, and Language Dropdown */}
        <Flex align="center" gap={4}>
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
          <Flex align="center">
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
          </Flex>

          {/* Language Dropdown */}
          <Select borderRadius="8" size="sm" width="100px">
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
          </Select>
        </Flex>
      </Flex>
    </Box>
  );
};
export default Header;
