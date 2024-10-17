import { VStack } from "@chakra-ui/react";
import CommonBarChart from "./CommonBarChart";
import Layout from "../../components/layout/Layout";
import BenefitSummary from "./BenefitSummary";
import KeyMatrics from "./KeyMatrics";
import React from "react";
import { applicationOverview } from "../../services/dashboard";
import Loading from "../../components/common_components/Loading";
function Dashboard() {
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    const userId = localStorage.getItem("user"); // Retrieve the user data from localStorage
    const fetchData = async () => {
      try {
        if (userId) {
          // Check if userId is not null
          const userObject = JSON.parse(userId); // Parse the JSON string to an object
          setIsLoading(true);
          // Extract the id, ensuring to handle possible null cases
          const id = userObject.id;
          const response = await applicationOverview(id);
          setIsLoading(false);
          setData(response);
        } else {
          console.log("No user data found.");
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout
      _titleBar={{ title: "Welcome back!" }}
      showMenu={true}
      showSearchBar={true}
      showLanguage={false}
    >
      {isLoading && <Loading />}
      <VStack gap="60px" py="60px">
        <KeyMatrics matricsData={data} />
        <BenefitSummary tableData={data} />
        <CommonBarChart chartData={data} />
      </VStack>
    </Layout>
  );
}

export default Dashboard;
