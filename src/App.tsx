import { Suspense } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeI18n } from "./i18n";
import approutes from "./routes/routes";

initializeI18n("local"); // Initialize i18n with default language
function App() {
  return (
    <ChakraProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Routes>
            {approutes.map((item, index) => (
              <Route
                key={item?.path + index}
                path={item?.path}
                element={<item.component />}
              />
            ))}
          </Routes>
        </Router>
      </Suspense>
    </ChakraProvider>
  );
}

export default App;
