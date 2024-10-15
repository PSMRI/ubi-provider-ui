import {
  Button,
  Center,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Image,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Logo from "../../assets/Images/GOM.png";
import Layout from "../../components/layout/Layout";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TH3 from "../../components/common/typography/TH3";
import TT2 from "../../components/common/typography/TT2";
import TT3 from "../../components/common/typography/TT3";
import React from "react";
import { Link } from "react-router-dom";
export default function UserRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = React.useState(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  return (
    <Layout showMenu={false} showSearchBar={false} showLanguage={true}>
      <HStack w="full" h="2xl" spacing={8} align="stretch">
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
        <VStack p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <TH3 fontSize={"2xl"}>{t("LOGIN_TITLE")}</TH3>
            <FormControl id="email">
              <TT2>{t("REGISTER_ORGANISATION_NAME")}</TT2>
              <Input type="text" />
              <TT2>{t("LOGIN_ENAIL_ID")}</TT2>
              <Input type="email" />
            </FormControl>

            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "column" }}
                align={"start"}
                justify={"space-between"}
              >
                <HStack>
                  <TT2>{t("LOGIN_TERMS_ACCEPT")}</TT2>
                  <TT2 color={"#0037b9"} textUnderlineOffset={"1px"}>
                    <Link to="#" className="custom-link">
                      {t("LOGIN_TERMS")}
                    </Link>{" "}
                  </TT2>
                  <TT2>{t("LOGIN_TERMS_ACCEPT_PROCEED")}</TT2>
                </HStack>
                <Checkbox isChecked={isChecked} onChange={handleCheckboxChange}>
                  <TT2>{t("LOGIN_AGREE")}</TT2>
                </Checkbox>
              </Stack>
              <Button
                colorScheme={"blue"}
                variant={"solid"}
                borderRadius={"100px"}
                isDisabled={!isChecked}
                onClick={() => {
                  // localStorage.setItem("token", "true");
                  navigate("/otp");
                }}
              >
                <TT3>{t("REGISTER_PROCEED")}</TT3>
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </HStack>
    </Layout>
  );
}
