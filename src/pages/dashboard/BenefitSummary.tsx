import { Text, VStack } from "@chakra-ui/react";
import PrimaryButton from "../../components/common/buttons/PrimaryButton";
import { useTranslation } from "react-i18next";
import BenefitsList from "../benefits/List";

interface BenefitSummaryProps {
  tableData: {
    benefit_summary: {
      id: number;
      name: string;
      applicants: number;
      approved: number;
      rejected: number;
      disbursalPending: number;
      deadline: string;
      status: string;
    }[];
  };
}

const BenefitSummary: React.FC<BenefitSummaryProps> = ({ tableData }) => {
  const { t } = useTranslation();
  // Check if benefit_summary is defined and is an array
  const benefits = tableData?.benefit_summary || [];
  return (
    <VStack spacing="60px" align="stretch" px="28px">
      <Text fontSize="36px" fontWeight="400" color={"#2F3036"} px="170px">
        {t("DASHBOARD_ALL_BENEFITS_SUMMARY")}
      </Text>
      {/* Tabs for Active, Closed, and Drafts */}
      <VStack spacing="35px" align="stretch">
        <BenefitsList
          _vstack={{
            px: "28px",
            pt: "10",
            boxShadow: "0px 2px 6px 2px #00000026",
          }}
          benefitData={{ benefit_summary: benefits }}
        />
        <VStack spacing="21px" align="stretch">
          <Text
            fontSize="16px"
            fontWeight="400"
            color={"#2F3036"}
            textAlign="center"
          >
            {"Showing 10 out of 50"}
          </Text>

          <PrimaryButton alignSelf="center" w="500px">
            {t("DASHBOARD_VIEW_DETAILS")}
          </PrimaryButton>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default BenefitSummary;
