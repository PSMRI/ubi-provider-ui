import React from "react";
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
export default function OTP() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [otp, setOtp] = React.useState(Array(6).fill(""));

  // Handle OTP input change
  const handleChange = (element: any, index: number) => {
    const value = element.target.value;
    if (!/^[0-9]$/.test(value) && value !== "") return; // Only allow numbers
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically focus on the next input box if value is entered
    if (value && element.target.nextSibling) {
      element.target.nextSibling.focus();
    }
  };
  return (
    <Layout>
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
              <Text color={"white"} textAlign="left">
                {t("HEADER_COMPANY_NAME")}
              </Text>
              <Text color={"white"} textAlign="left">
                {t("LOGIN_RIGHT_TEXT_H2")}
              </Text>
              <Text color={"white"} textAlign="left">
                {t("LOGIN_RIGHT_TEXT_H3")}
              </Text>
            </VStack>
          </HStack>
        </VStack>
        <VStack p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Heading fontSize={"2xl"}>{t("OTP_LOGIN")}</Heading>
            <Heading fontSize={"2xl"}>{t("OTP_WELCOME")}</Heading>
            <FormControl id="email">
              <FormLabel>{t("OTP_ENTER_OTP")}</FormLabel>

              <HStack spacing={2}>
                {otp.map((data, index) => (
                  <Input
                    key={index}
                    type="text"
                    maxLength={1} // Limit input to 1 character
                    value={data}
                    onChange={(e) => handleChange(e, index)}
                    onFocus={(e) => e.target.select()} // Select input on focus
                    textAlign="center" // Center align the text
                    size="lg" // Larger input size
                    width="3rem" // Custom width for OTP boxes
                  />
                ))}
              </HStack>
            </FormControl>
            <Stack spacing={6}>
              <Text>{t("OTP_RESEND")}</Text>
              <Button
                colorScheme={"blue"}
                variant={"solid"}
                onClick={() => {
                  localStorage.setItem("token", "true");
                  navigate(0);
                }}
              >
                {t("LOGIN_LOGIN")}
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </HStack>
    </Layout>
  );
}
