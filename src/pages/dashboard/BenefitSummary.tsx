import { VStack } from "@chakra-ui/react";
import { TD2, TT2, PrimaryButton } from "@common";
import { useTranslation } from "react-i18next";
import BenefitsList from "../benefits/List";

const BenefitSummary = () => {
  const { t } = useTranslation();

  return (
    <VStack spacing="60px" align="stretch" px="28px">
      <TD2 color={"#2F3036"} px="170px">
        {t("DASHBOARD_ALL_BENEFITS_SUMMARY")}
      </TD2>
      {/* Tabs for Active, Closed, and Drafts */}
      <VStack spacing="35px" align="stretch">
        <BenefitsList
          _vstack={{
            px: "28px",
            pt: "10",
            boxShadow: "0px 2px 6px 2px #00000026",
          }}
        />
        <VStack spacing="21px" align="stretch">
          <TT2 color={"#2F3036"} textAlign="center">
            {"Showing 10 out of 50"}
          </TT2>

          <PrimaryButton alignSelf="center" w="500px">
            {t("DASHBOARD_VIEW_DETAILS")}
          </PrimaryButton>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default BenefitSummary;
