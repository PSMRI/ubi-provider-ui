import { HStack, Image, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Logo from "../../../assets/Images/GOM.png";
import TH3 from "../typography/TH3";
import TT2 from "../typography/TT2";

export default function LeftSideBar() {
  const { t } = useTranslation();
  return (
    <VStack
      flex={1}
      backgroundColor={"#121943"}
      align={"center"}
      justify={"center"}
    >
      <HStack>
        <Image src={Logo} />
        <VStack align={"start"}>
          <TH3 color={"white"} textAlign="left">
            {t("HEADER_COMPANY_NAME")}
          </TH3>
          <TT2 color={"white"} textAlign="left">
            {t("LOGIN_RIGHT_TEXT_H2")}
          </TT2>
          <TT2 color={"white"} textAlign="left">
            {t("LOGIN_RIGHT_TEXT_H3")}
          </TT2>
        </VStack>
      </HStack>
    </VStack>
  );
}
