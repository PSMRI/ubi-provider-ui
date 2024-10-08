import { Suspense, useState, useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeI18n } from "./i18n";
import authRoutes from "./routes/authRoutes";
import guestRoutes from "./routes/guestRoutes";
import Loading from "./components/common/Loading";

initializeI18n("local"); // Initialize i18n with default language
function App() {
  const [routes, setRoutes] = useState<
    { path: string; component: React.ElementType }[]
  >([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setRoutes(authRoutes);
    } else {
      setRoutes(guestRoutes);
    }
  }, []);

  return (
    <ChakraProvider>
      <Suspense fallback={<Loading />}>
        <Router>
          <Routes>
            {routes?.map((item, index) => (
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
