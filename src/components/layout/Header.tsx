import React, { useState } from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  Text,
  Avatar,
  MenuDivider,
  Icon,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { FiUser, FiLogOut } from "react-icons/fi";
import Logo from "../../assets/Images/logo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../common/modal/UserProfile";

interface HeaderProps {
  showMenu?: boolean;
  showSearchBar?: boolean;
  showLanguage?: boolean;
}

interface MenuOption {
  name: string;
  icon?: React.ReactElement; // icon can be a React node
  onClick?: () => void; // optional click handler
}

interface MenuItem {
  label: string;
  option?: MenuOption[];
  onClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showMenu,
  showSearchBar,
  showLanguage,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Use isSuperAdmin from context for filtering menu items
  const { isSuperAdmin } = useAuth();

  // Updated menu names - remove logout from here since it's now in user dropdown
  const menuNames = [
    {
      label: "Benefit List",
      onClick: () => {
        navigate("/");
      },
    },
    {
      label: "Provider Management",
      option: [
        {
          name: "Add Provider User",
          onClick: () => {
            navigate("/admin/add-user");
          },
        },
        {
          name: "Add Provider",
          onClick: () => {
            navigate("/admin/add-role");
          },
        },
      ],
    },
  ];

  const filteredMenuNames = isSuperAdmin
    ? menuNames
    : menuNames.filter((menu) => menu.label !== "Provider Management");

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
      <HStack
        align="center"
        justify="space-between"
        w="100%"
      >
        {/* Left Section: Logo and Company Name */}
        <HStack>
          <img
            src={Logo}
            alt="Logo"
            style={{ width: "40px", marginRight: "8px" }}
          />
          <Text color="#484848" fontWeight={500} fontSize={"28px"}>
            {t("LEFTSIDE_CONTENT_HEADER_COMPANY_NAME")}
          </Text>
        </HStack>

        {/* Right Section: Menu, User Profile, and Language */}
        <HeaderRightSection
          showMenu={showMenu}
          showSearchBar={showSearchBar}
          showLanguage={showLanguage}
          menuNames={filteredMenuNames}
        />
      </HStack>
    </Box>
  );
};

interface HeaderRightSectionProps {
  showMenu?: boolean;
  showSearchBar?: boolean; //NOSONAR
  showLanguage?: boolean;
  menuNames: MenuItem[]; // add new
}

const HeaderRightSection: React.FC<HeaderRightSectionProps> = ({
  showMenu,
  showLanguage,
  menuNames,
}) => {
  const location = useLocation();
  return (

    <HStack align="center" spacing={6}>
      {/* Navigation Menu */}
      {showMenu && menuNames.map((menu, index) => {
        const isActiveBenefit = location.pathname === "/" && menu.label === "Benefit List";
        const menuKey = menu?.label || index;

        if (menu?.option) {
          return (
            <HStack key={menuKey} align="center">
              <DropdownMenu menu={menu} currentPath={location.pathname} />
            </HStack>
          );
        }

        return (
          <HStack key={menuKey} align="center">
            <Text
              fontSize="16px"
              fontWeight={isActiveBenefit ? "bold" : 400}
              cursor="pointer"
              onClick={menu?.onClick}
              color={isActiveBenefit ? "#06164B" : "black"}
            >
              {menu?.label}
            </Text>
          </HStack>
        );
      })}

      {/* Language Dropdown */}
      {showLanguage && <LanguageDropdown />}

      {/* User Profile Dropdown - positioned in top right corner */}
      {showMenu && <UserProfileDropdown />}
    </HStack>

  );
};

interface DropdownMenuProps {
  menu: MenuItem;
  currentPath: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ menu, currentPath }) => {
  // Define the paths for Provider Management routes
  const providerPaths = ["/admin/add-user", "/admin/add-role"];

  // Determine if the current path matches any provider path to highlight the dropdown label
  const isActive =
    menu.label === "Provider Management" && providerPaths.includes(currentPath);

  return (
    <Menu>
      <MenuButton
        as={Box}
        fontWeight={isActive ? "bold" : "normal"}
        cursor="pointer"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        color={isActive ? "#06164B" : "black"}
        fontSize="16px"
      >
        <HStack spacing={1}>
          {menu?.label && (
            <Text fontWeight={isActive ? "bold" : 400}>{menu?.label}</Text>
          )}
          <ChevronDownIcon />
        </HStack>
      </MenuButton>
      <MenuList>
        {menu?.option?.map((submenuItem: MenuOption, subIndex: number) => (
          <MenuItem
            key={submenuItem.name || subIndex}
            icon={submenuItem.icon}
            cursor="pointer"
            onClick={submenuItem.onClick}
          >
            {submenuItem.name}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

/*
const SearchBar: React.FC = () => (
  <HStack align="center">
    <InputGroup maxWidth="300px" rounded={"full"} size="lg">
      <Input placeholder="Search For Benefit" rounded={"full"} bg="#E9E7EF" />
      <InputRightElement>
        <SearchIcon color="gray.500" />
      </InputRightElement>
    </InputGroup>
  </HStack>
); //NOSONAR
*/

const LanguageDropdown: React.FC = () => (
  <Select borderRadius="8" size="sm" width="100px">
    <option value="en">English</option>
  </Select>
);

// Simple and Compact User Profile Dropdown
const UserProfileDropdown: React.FC = () => {
  const { t } = useTranslation();
  const { getUserDisplayName, getUserOrganization, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userName = getUserDisplayName();
  const userOrg = getUserOrganization();

  const handleLogout = () => {
    logout('manual'); // Use context logout with manual reason
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  const handleProfileClose = () => {
    setIsProfileOpen(false);
  };

  // Always show the dropdown, even if user data is not available
  const displayName = userName || "User";
  const displayOrg = userOrg || "";

  return (
    <>
      <Menu>
        <MenuButton
          cursor="pointer"
          px={2}
          py={1}
          borderRadius="full"
          _hover={{ bg: "gray.50" }}
          transition="all 0.2s"
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Avatar
            size="sm"
            name={displayName}
            bg="#06164B"
            color="white"
            fontSize="xs"
          />
          <ChevronDownIcon color="gray.500" boxSize={3} />
        </MenuButton>

        <MenuList minW="200px" shadow="md">
          {/* User Info Header - Compact */}
          <Box px={3} py={2} bg="gray.50">
            <Text fontSize="sm" fontWeight="medium" color="gray.800" noOfLines={1}>
              {displayName}
            </Text>
            {displayOrg && (
              <Text fontSize="xs" color="gray.600" noOfLines={1}>
                {displayOrg}
              </Text>
            )}
          </Box>

          <MenuDivider />

          {/* Simple Menu Items */}
          <MenuItem
            icon={<Icon as={FiUser} boxSize={4} />}
            fontSize="sm"
            onClick={handleProfileClick}
          >
            Profile
          </MenuItem>

          <MenuItem
            icon={<Icon as={FiLogOut} boxSize={4} />}
            fontSize="sm"
            color="red.600"
            onClick={handleLogout}
          >
            {t("HEADER_LOGOUT_BUTTON")}
          </MenuItem>
        </MenuList>
      </Menu>

      {/* User Profile Modal */}
      <UserProfile isOpen={isProfileOpen} onClose={handleProfileClose} />
    </>
  );
};

export default Header;
