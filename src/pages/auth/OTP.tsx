import {
  Button,
  FormControl,
  HStack,
  Stack,
  VStack,
  PinInput,
  PinInputField,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

import Layout from "../../components/layout/Layout";
import LeftSideBar from "../../components/common/login/LeftSideBar";
import { sendOTP, userRegister } from "../../services/auth";
import Loading from "../../components/common_components/Loading";

export default function OTP() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();
  const [otp, setOtp] = React.useState();
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);
  const [timer, setTimer] = React.useState(300); // 5 minutes countdown (300 seconds)
  const otpArray = Array(6).fill("");
  const [isLoading, setIsLoading] = React.useState(false);
  const fromPage = location?.state?.fromPage || "login";
  // Handle OTP input change
  const handleChange = (element: any) => {
    setOtp(element);
    setIsSubmitDisabled(element.length !== 6);
  };

  // Countdown timer effect
  React.useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const handleOtp = async () => {
    setIsLoading(true);
    const otpNumber = Number(otp);
    const email = localStorage.getItem("Email");
    if (fromPage == "registration" && email) {
      const registerResponse = await userRegister(otpNumber, email);
      setIsLoading(false);
      if (registerResponse?.jwt) {
        localStorage.setItem("token", "true");
        localStorage.setItem("user", JSON.stringify(registerResponse?.user));
        navigate("/");
        window.location.reload();
      }
    } else if (fromPage == "login" && email) {
      const otpLoginResponse = await sendOTP(otpNumber, email);
      setIsLoading(false);
      if (otpLoginResponse?.jwt) {
        localStorage.setItem("token", "true");
        localStorage.setItem("user", JSON.stringify(otpLoginResponse?.user));
        navigate("/");
        window.location.reload();
      }
    }
  };
  //conflict solve
  return (
    <Layout showMenu={false} showSearchBar={false} showLanguage={true}>
      {isLoading ? (
        <Loading />
      ) : (
        <HStack w="full" h="lg" spacing={8} align="stretch">
          <LeftSideBar />
          <VStack p={8} flex={1} align={"center"} justify={"center"}>
            <Stack spacing={4} w={"full"}>
              <Text fontSize={"24px"} fontWeight={400}>
                {fromPage === "registration"
                  ? t("LOGIN_REGISTER_TITLE")
                  : t("OTP_LOGIN")}
              </Text>
              <Text fontSize={"16px"} fontWeight={400}>
                {t("OTP_WELCOME")}
              </Text>
              <FormControl id="email">
                <Text fontSize={"16px"} fontWeight={400}>
                  {t("OTP_ENTER_OTP")}
                </Text>

                <HStack>
                  <PinInput
                    size="lg"
                    value={otp}
                    onChange={(e) => handleChange(e)}
                    otp
                  >
                    {otpArray?.map((feild) => {
                      return <PinInputField key={feild} type="text" />;
                    })}
                  </PinInput>
                </HStack>
              </FormControl>
              <Stack spacing={6}>
                <Text fontSize={"16px"} fontWeight={400}>
                  {t("OTP_RESEND")}
                  {formatTime(timer)}
                </Text>

                <Button
                  colorScheme={"blue"}
                  variant={"solid"}
                  borderRadius={"100px"}
                  isDisabled={isSubmitDisabled}
                  onClick={() => handleOtp()}
                >
                  <Text fontSize={"14px"} fontWeight={400}>
                    {t("OTP_SUBMIT")}
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
