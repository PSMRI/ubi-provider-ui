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
export default function UserRegister() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
            <Heading fontSize={"2xl"}>{t("LOGIN_TITLE")}</Heading>
            <FormControl id="email">
              <FormLabel>{t("REGISTER_ORGANISATION_NAME")}</FormLabel>
              <Input type="text" />
              <FormLabel>{t("LOGIN_ENAIL_ID")}</FormLabel>
              <Input type="email" />
            </FormControl>

            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "column" }}
                align={"start"}
                justify={"space-between"}
              >
                <Text>{t("LOGIN_TERMS")}</Text>
                <Text>{t("LOGIN_TERMS_ACCEPT")}</Text>
                <Checkbox>{t("LOGIN_AGREE")}</Checkbox>
              </Stack>
              <Button
                colorScheme={"blue"}
                variant={"solid"}
                onClick={() => {
                  // localStorage.setItem("token", "true");
                  navigate("/otp");
                }}
              >
                {t("REGISTER_PROCEED")}
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </HStack>
    </Layout>
  );
}
