import React from "react";
import {
  Button,
  Checkbox,
  FormControl,
  HStack,
  Input,
  Stack,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import LeftSideBar from "../../components/common/login/LeftSideBar";
import { registerProvider } from "../../services/auth";
import Loading from "../../components/common_components/Loading";
import ModalShow from "../../components/common/modal/ModalShow";
import AlertMessage from "../../components/common/modal/AlertMessage";
export default function UserRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = React.useState(false);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [showTooltip, setShowTooltip] = React.useState(false);

  const handleRegister = async () => {
    localStorage.setItem("Email", email);
    setIsLoading(true);
    try {
      const registerResponse = await registerProvider(name, email);
      setIsLoading(false);
      if (registerResponse) {
        navigate("/otp", { state: { fromPage: "registration" } });
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
  //conflict solve
  return (
    <Layout showMenu={false} showSearchBar={false} showLanguage={true}>
      {isLoading ? (
        <Loading />
      ) : (
        <HStack w="full" h="89vh" spacing={8} align="stretch">
          <LeftSideBar />
          <VStack p={8} flex={1} align={"center"} justify={"center"} w={"full"}>
            <Stack spacing={6} w={"full"}>
              <Text fontSize={"24px"} fontWeight={400} marginBottom={"14px"}>
                {t("LOGIN_REGISTER_TITLE")}
              </Text>
              <FormControl id="email">
                <Text fontSize={"16px"} fontWeight={400} marginBottom={"12px"}>
                  {t("REGISTER_ORGANISATION_NAME")}
                </Text>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Organisation Name"
                  isRequired
                  marginBottom={"12px"}
                />
                <Text fontSize={"16px"} fontWeight={400} marginBottom={"12px"}>
                  {t("LOGIN_ENAIL_ID")}
                </Text>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Organisation Email"
                  isRequired
                  marginBottom={"12px"}
                />
              </FormControl>

              <Stack spacing={6}>
                <Stack
                  direction={{ base: "column", sm: "column" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  <HStack marginBottom={"22px"}>
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
                  <Tooltip
                    isOpen={showTooltip}
                    onClose={() => setShowTooltip(false)}
                    label="Please click on Terms and Condition Link"
                    placement="top"
                  >
                    <Checkbox
                      isChecked={isChecked}
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                    >
                      <Text fontSize={"16px"} fontWeight={400}>
                        {t("LOGIN_AGREE")}
                      </Text>
                    </Checkbox>
                  </Tooltip>
                </Stack>
                <Button
                  colorScheme={"blue"}
                  variant={"solid"}
                  borderRadius={"100px"}
                  isDisabled={!isChecked || !email || !name}
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
