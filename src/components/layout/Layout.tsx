// src/components/Layout.tsx

import React from "react";
import { VStack } from "@chakra-ui/react";
import Header from "./Header";

// Define the props for the layout
interface LayoutProps {
  children: React.ReactNode; // Allows for passing children
  showMenu?: boolean;
  showSearchBar?: boolean;
  showLanguage?: boolean;
}

// Layout Component
const Layout: React.FC<LayoutProps> = ({
  children,
  showMenu,
  showSearchBar,
  showLanguage,
}) => {
  return (
    <VStack w={"100vw"} h={"100vh"} align={"stretch"} pt="80px">
      {/* Header */}
      <Header
        showMenu={showMenu}
        showSearchBar={showSearchBar}
        showLanguage={showLanguage}
      />

      {/* Content */}
      {children}
    </VStack>
  );
};

export default Layout;
