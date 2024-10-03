import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "./Components/Layout/Layout";
import { initializeI18n } from "./i18n";
import Login from "./Components/Layout/Login";
initializeI18n("local"); // Initialize i18n with default language
function App() {
  return (
    <ChakraProvider>
      <Layout>
        <Login />
      </Layout>
    </ChakraProvider>
  );
}

export default App;
