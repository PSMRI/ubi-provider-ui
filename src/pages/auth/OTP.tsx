import {
  Button,
  FormControl,
  HStack,
  Image,
  Input,
  Stack,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Images/GOM.png";
import TH3 from "../../components/common/typography/TH3";
import TT2 from "../../components/common/typography/TT2";
import TT3 from "../../components/common/typography/TT3";
import Layout from "../../components/layout/Layout";
export default function OTP() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [otp, setOtp] = React.useState(Array(6).fill(""));

  // Handle OTP input change
  const handleChange = (element: any, index: number) => {
    const value = element.target.value;
    if (!/^\d$/.test(value) && value !== "") return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically focus on the next input box if value is entered
    if (value && element.target.nextSibling) {
      element.target.nextSibling.focus();
    }
  };

  // Handle backspace
  const handleBackspace = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && index > 0 && otp[index] === "") {
      const previousSibling = (event.target as HTMLInputElement)
        .previousElementSibling as HTMLInputElement | null;
      if (previousSibling) {
        previousSibling.focus();
      }
    }
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
            <TH3>{t("OTP_LOGIN")}</TH3>
            <TT2>{t("OTP_WELCOME")}</TT2>
            <FormControl id="email">
              <TT2>{t("OTP_ENTER_OTP")}</TT2>

              <HStack spacing={2}>
                {otp.map((data, index) => (
                  <Input
                    key={data + index}
                    type="text"
                    maxLength={1} // Limit input to 1 character
                    value={data}
                    onChange={(e) => handleChange(e, index)}
                    onFocus={(e) => e.target.select()} // Select input on focus
                    onKeyDown={(e) => handleBackspace(index, e)}
                    textAlign="center" // Center align the text
                    size="lg" // Larger input size
                    width="3rem" // Custom width for OTP boxes
                  />
                ))}
              </HStack>
            </FormControl>
            <Stack spacing={6}>
              <TT2>{t("OTP_RESEND")}</TT2>
              <Button
                colorScheme={"blue"}
                variant={"solid"}
                borderRadius={"100px"}
                onClick={() => {
                  localStorage.setItem("token", "true");
                  navigate(0);
                }}
              >
                <TT3>{t("LOGIN_LOGIN")}</TT3>
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </HStack>
    </Layout>
  );
}
