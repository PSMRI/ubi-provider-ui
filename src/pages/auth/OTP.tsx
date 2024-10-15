import {
  Button,
  FormControl,
  HStack,
  Image,
  Input,
  Stack,
  VStack,
  PinInput,
  PinInputField,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Images/GOM.png";
import TH3 from "../../components/common/typography/TH3";
import TT2 from "../../components/common/typography/TT2";
import TT3 from "../../components/common/typography/TT3";
import Layout from "../../components/layout/Layout";
import LeftSideBar from "../../components/common/login/LeftSideBar";
import { LoginProvider, sendOTP } from "../../services/auth";

export default function OTP() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [otp, setOtp] = React.useState();
  const [isResendDisabled, setIsResendDisabled] = React.useState(true); // Control resend button
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true);
  const [timer, setTimer] = React.useState(300); // 5 minutes countdown (300 seconds)
  const otpArray = Array(6).fill("");

  // Handle OTP input change
  const handleChange = (element: any) => {
    setOtp(element);
    setIsSubmitDisabled(element.length !== 6);
  };

  // Function to handle resend OTP
  const handleResendOTP = () => {
    // Reset the timer to 5 minutes (300 seconds)
    setTimer(300);
    setIsResendDisabled(true); // Disable the resend button
    console.log("Resending OTP...");
  };

  // Countdown timer effect
  React.useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setIsResendDisabled(false); // Enable the resend button after 5 minutes
    }
  }, [timer]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  const handleOtp = async () => {
    const otpNumber = Number(otp);
    const email = localStorage.getItem("Email");
    const otpLoginResponse = await sendOTP(otpNumber, email);
    console.log(otpLoginResponse);
  };
  return (
    <Layout showMenu={false} showSearchBar={false} showLanguage={true}>
      <HStack w="full" h="lg" spacing={8} align="stretch">
        <LeftSideBar />
        <VStack p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"}>
            <TH3>{t("OTP_LOGIN")}</TH3>
            <TT2>{t("OTP_WELCOME")}</TT2>
            <FormControl id="email">
              <TT2>{t("OTP_ENTER_OTP")}</TT2>

              <HStack>
                <PinInput
                  size="lg"
                  value={otp}
                  onChange={(e) => handleChange(e)}
                  otp
                >
                  {otpArray?.map((feild, index) => {
                    return <PinInputField key={feild + index} />;
                  })}
                </PinInput>
              </HStack>
            </FormControl>
            <Stack spacing={6}>
              <TT2>
                {t("OTP_RESEND")}
                {formatTime(timer)}
              </TT2>

              <Button
                colorScheme={"blue"}
                variant={"solid"}
                borderRadius={"100px"}
                isDisabled={isSubmitDisabled}
                onClick={() => handleOtp()}
              >
                <TT3>{t("OTP_SUBMIT")}</TT3>
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </HStack>
    </Layout>
  );
}
