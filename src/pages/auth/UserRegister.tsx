import React from "react";
import {
  Button,
  Checkbox,
  FormControl,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import LeftSideBar from "../../components/common/login/LeftSideBar";
import { registerProvider } from "../../services/auth";
import Loading from "../../components/common_components/Loading";
export default function UserRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };

  const handleRegister = async () => {
    localStorage.setItem("Email", email);
    setIsLoading(true);
    const registerResponse = await registerProvider(name, email);
    setIsLoading(false);
    if (registerResponse) {
      navigate("/otp", { state: { fromPage: "registration" } });
    }
  };
  return (
    <Layout showMenu={false} showSearchBar={false} showLanguage={true}>
      {isLoading ? (
        <Loading />
      ) : (
        <HStack w="full" h="lg" spacing={8} align="stretch">
          <LeftSideBar />
          <VStack p={8} flex={1} align={"center"} justify={"center"} w={"full"}>
            <Stack spacing={4} w={"full"}>
              <Text fontSize={"24px"} fontWeight={400}>
                {t("LOGIN_TITLE")}
              </Text>
              <FormControl id="email">
                <Text fontSize={"16px"} fontWeight={400}>
                  {t("REGISTER_ORGANISATION_NAME")}
                </Text>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  isRequired
                />
                <Text fontSize={"16px"} fontWeight={400}>
                  {t("LOGIN_ENAIL_ID")}
                </Text>
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
                    <Text fontSize={"16px"} fontWeight={400}>
                      {t("LOGIN_TERMS_ACCEPT")}
                    </Text>
                    <Text
                      fontSize={"16px"}
                      fontWeight={400}
                      color={"#0037b9"}
                      textUnderlineOffset={"1px"}
                    >
                      <Link to="#" className="custom-link">
                        {t("LOGIN_TERMS")}
                      </Link>{" "}
                    </Text>
                    <Text fontSize={"16px"} fontWeight={400}>
                      {t("LOGIN_TERMS_ACCEPT_PROCEED")}
                    </Text>
                  </HStack>
                  <Checkbox
                    isChecked={isChecked}
                    onChange={handleCheckboxChange}
                  >
                    <Text fontSize={"16px"} fontWeight={400}>
                      {t("LOGIN_AGREE")}
                    </Text>
                  </Checkbox>
                </Stack>
                <Button
                  colorScheme={"blue"}
                  variant={"solid"}
                  borderRadius={"100px"}
                  isDisabled={!isChecked}
                  onClick={() => handleRegister()}
                >
                  {/* {
                  localStorage.setItem("token", "true");
                  
                  navigate("/otp");
                } */}
                  <Text fontSize="14px" fontWeight="400">
                    {t("REGISTER_PROCEED")}
                  </Text>
                </Button>
              </Stack>
            </Stack>
          </VStack>
        </HStack>
      )}
    </Layout>
  );
}
