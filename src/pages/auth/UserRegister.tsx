import React from "react";
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
import Logo from "../../assets/Images/GOM.png";
import TH3 from "../../components/common/typography/TH3";
import TT2 from "../../components/common/typography/TT2";
import TT3 from "../../components/common/typography/TT3";
import Layout from "../../components/layout/Layout";
import { Link } from "react-router-dom";
import LeftSideBar from "../../components/common/login/LeftSideBar";
import { registerProvider } from "../../services/auth";
export default function UserRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleRegister = async () => {
    setName(name);
    setEmail(email);
    const registerResponse = registerProvider(name, email);
    console.log(registerResponse);
    if (registerResponse) {
      navigate("/otp");
    }
  };
  return (
    <Layout showMenu={false} showSearchBar={false} showLanguage={true}>
      <HStack w="full" h="lg" spacing={8} align="stretch">
        <LeftSideBar />
        <VStack p={8} flex={1} align={"center"} justify={"center"} w={"full"}>
          <Stack spacing={4} w={"full"}>
            <TH3 fontSize={"2xl"}>{t("LOGIN_TITLE")}</TH3>
            <FormControl id="email">
              <TT2>{t("REGISTER_ORGANISATION_NAME")}</TT2>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isRequired
              />
              <TT2>{t("LOGIN_ENAIL_ID")}</TT2>
              <Input
                type="email"
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
                onClick={() => handleRegister(name, email)}
              >
                {/* {
                  localStorage.setItem("token", "true");
                  
                  navigate("/otp");
                } */}
                <TT3>{t("REGISTER_PROCEED")}</TT3>
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </HStack>
    </Layout>
  );
}
