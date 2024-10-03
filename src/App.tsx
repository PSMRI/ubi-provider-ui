import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeI18n } from "./i18n";
import Approutes from "./routes/routes";

initializeI18n("local"); // Initialize i18n with default language
function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          {Approutes.map((item: any) => (
            <Route
              key={item.path}
              path={item.path}
              element={<item.component />}
            />
          ))}
        </Routes>
      </Router>
      {/* <Router>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Form />} />
      </Router> */}
      {/* <Form /> */}
    </ChakraProvider>
  );
}

export default App;
