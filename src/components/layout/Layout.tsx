// src/components/Layout.tsx

import React from "react";
import { Box } from "@chakra-ui/react";
import Header from "./Header";
import TitleBar from "../common/TitleBar";

// Define the props for the layout
interface LayoutProps {
  children: React.ReactNode; // Allows for passing children
  showMenu?: boolean;
  showSearchBar?: boolean;
  showLanguage?: boolean;
  _titleBar?: object;
}

// Layout Component
const Layout: React.FC<LayoutProps> = ({
  children,
  showMenu,
  showSearchBar,
  showLanguage,
  _titleBar,
}) => {
  return (
    <Box>
      {/* Header */}
      <Header
        showMenu={showMenu}
        showSearchBar={showSearchBar}
        showLanguage={showLanguage}
      />
      {_titleBar && <TitleBar title="" {..._titleBar} />}

      {/* Content */}
      {children}
    </Box>
  );
};

export default Layout;
