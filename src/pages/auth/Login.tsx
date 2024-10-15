import {
  Button,
  Checkbox,
  FormControl,
  HStack,
  Image,
  Input,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TH3 from "../../components/common/typography/TH3";
import TT2 from "../../components/common/typography/TT2";
import TT3 from "../../components/common/typography/TT3";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import LeftSideBar from "../../components/common/login/LeftSideBar";
import React from "react";
import { LoginProvider } from "../../services/auth";
export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  const handleLogin = async () => {
    localStorage.setItem("Email", email);
    const loginResponse = await LoginProvider(email);
    console.log(loginResponse);
    if (loginResponse) {
      navigate("/otp");
      window.location.reload();
    }
  };
  return (
    <Layout showMenu={false} showSearchBar={false} showLanguage={true}>
      <HStack w="full" h="lg" spacing={8} align="stretch">
        <LeftSideBar />

        <VStack p={8} flex={1} align={"center"} justify={"center"} w={"full"}>
          <Stack spacing={4} w={"full"}>
            <TH3 textAlign={"left"}>{t("LOGIN_TITLE")}</TH3>
            <FormControl id="email">
              <TT2>{t("LOGIN_ENAIL_ID")}</TT2>
              <Input
                type="email"
                w={"full"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
              />
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
                onClick={handleLogin}
              >
                <TT3>{t("LOGIN_LOGIN")}</TT3>
              </Button>
              <Button
                colorScheme={"blue"}
                variant={"outline"}
                borderRadius={"100px"}
                onClick={() => {
                  // localStorage.setItem("token", "true");
                  navigate("/user/register");
                }}
              >
                <TT3>{t("LOGIN_REGISTER")}</TT3>
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </HStack>
    </Layout>
  );
}
