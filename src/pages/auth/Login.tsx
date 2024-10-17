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
import React from "react";
import { LoginProvider } from "../../services/auth";
import Loading from "../../components/common_components/Loading";
import ModalShow from "../../components/common/modal/ModalShow";
export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
  };
  const handleLogin = async () => {
    setIsLoading(true);
    localStorage.setItem("Email", email);
    const loginResponse = await LoginProvider(email);
    if (loginResponse) {
      setIsLoading(false);
      navigate("/otp", { state: { fromPage: "login" } });
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setIsChecked(true);
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
              <Text fontSize={"24px"} fontWeight={400} textAlign={"left"}>
                {t("LOGIN_TITLE")}
              </Text>
              <FormControl id="email">
                <Text fontSize={"16px"} fontWeight={400}>
                  {t("LOGIN_ENAIL_ID")}
                </Text>
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
                    <Text fontSize={"16px"} fontWeight={400}>
                      {t("LOGIN_TERMS_ACCEPT")}
                    </Text>
                    <Text
                      fontSize={"16px"}
                      fontWeight={400}
                      color={"#0037b9"}
                      textUnderlineOffset={"1px"}
                    >
                      <Link
                        to="#"
                        className="custom-link"
                        onClick={() => setOpen(true)}
                      >
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
                  onClick={handleLogin}
                >
                  <Text fontSize={"14px"} fontWeight={400}>
                    {t("LOGIN_LOGIN")}
                  </Text>
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
                  <Text fontSize={"14px"} fontWeight={400}>
                    {t("LOGIN_REGISTER")}
                  </Text>
                </Button>
              </Stack>
            </Stack>
          </VStack>
        </HStack>
      )}

      {open && <ModalShow show={open} close={handleCloseModal} />}
    </Layout>
  );
}
