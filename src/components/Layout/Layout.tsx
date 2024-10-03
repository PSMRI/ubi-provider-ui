// src/components/Layout.tsx

import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import Header from "./Header";

// Define the props for the layout
interface LayoutProps {
  children: React.ReactNode; // Allows for passing children
}

// Layout Component
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex pt="80px" direction="column">
      {/* Header */}
      <Header />

      {/* Content */}
      <Box>{children}</Box>
    </Flex>
  );
};

export default Layout;
