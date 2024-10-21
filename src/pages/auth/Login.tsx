import {
  Button,
  Checkbox,
  FormControl,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import LeftSideBar from "../../components/common/login/LeftSideBar";
import React from "react";
import { LoginProvider } from "../../services/auth";
import Loading from "../../components/common_components/Loading";
import ModalShow from "../../components/common/modal/ModalShow";
import AlertMessage from "../../components/common/modal/AlertMessage";
export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [showTooltip, setTooltip] = React.useState(false); // conficts
  const handleLogin = async () => {
    setIsLoading(true);
    localStorage.setItem("Email", email);
    try {
      const loginResponse = await LoginProvider(email);
      if (loginResponse) {
        setIsLoading(false);
        navigate("/otp", { state: { fromPage: "login" } });
      } else {
        setIsLoading(false);
        setMessage("Please contact admin!");
        setShowAlert(true);
      }
    } catch (err) {
      setIsLoading(false);
      setMessage(err as string);
      setShowAlert(true);
    }
  };

  const handleCloseAlertModal = () => {
    setShowAlert(false);
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
        <HStack w="full" h="89vh" spacing={8} align="stretch" overflow="hidden">
          <LeftSideBar />

          <VStack
            p={8}
            spacing={4}
            flex={1}
            align={"center"}
            justify={"center"}
            w={"full"}
            h={"full"} // Ensure full height is used
            overflow="hidden"
          >
            <Stack spacing={4} w={"full"}>
              <Text
                fontSize={"24px"}
                fontWeight={400}
                textAlign={"left"}
                marginBottom={"14px"}
              >
                {t("LOGIN_TITLE")}
              </Text>
              <FormControl id="email" mt={60}>
                <Text fontSize={"16px"} fontWeight={400}>
                  {t("LOGIN_ENAIL_ID")}
                </Text>
                <Input
                  type="email"
                  w={"full"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isRequired
                  marginTop={"14px"}
                  placeholder="Organisation Email"
                />
              </FormControl>

              <Stack spacing={6}>
                <Stack
                  direction={{ base: "column", sm: "column" }}
                  align={"start"}
                  justify={"space-between"}
                  mt={6}
                >
                  <HStack marginBottom={"14px"}>
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
                  <HStack marginLeft={"24px"}>
                    <Tooltip
                      label="Please click on Terms and Condition Link"
                      isOpen={showTooltip}
                      onClose={() => setTooltip(false)}
                      placement="top"
                    >
                      <Checkbox
                        isChecked={isChecked}
                        onMouseEnter={() => setTooltip(true)}
                        onMouseLeave={() => setTooltip(false)}
                      >
                        <Text
                          fontSize={"16px"}
                          fontWeight={400}
                          //
                          // marginLeft={"24px"}
                        >
                          {t("LOGIN_AGREE")}
                        </Text>
                      </Checkbox>
                    </Tooltip>
                  </HStack>
                </Stack>
                <Button
                  colorScheme={"blue"}
                  variant={"solid"}
                  borderRadius={"100px"}
                  isDisabled={!isChecked || email === ""}
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
      {showAlert && (
        <AlertMessage
          message={message}
          show={showAlert}
          close={handleCloseAlertModal}
        />
      )}
    </Layout>
  );
}
