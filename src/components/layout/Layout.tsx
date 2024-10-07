// src/components/Layout.tsx

import React from "react";
import { VStack } from "@chakra-ui/react";
import Header from "./Header";

// Define the props for the layout
interface LayoutProps {
  children: React.ReactNode; // Allows for passing children
}

// Layout Component
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <VStack align={"stretch"} pt="80px" pl={"10px"}>
      {/* Header */}
      <Header />

      {/* Content */}
      {children}
    </VStack>
  );
};

export default Layout;
