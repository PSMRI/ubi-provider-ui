import {
  Button,
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
export default function Login() {
  const navigate = useNavigate();
  return (
    <Layout>
      <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
        <VStack flex={1} backgroundColor={"#121943"}>
          <Stack>
            <HStack>
              <Image src={Logo} />
              <VStack>
                <Text color={"white"}>Universal Benefits Platform</Text>
                <Text color={"white"}>Official Use Only</Text>
                <Text color={"white"}>
                  Welcome to the Benefit creation platform
                </Text>
              </VStack>
            </HStack>
          </Stack>
        </VStack>
        <VStack p={8} flex={1} align={"center"} justify={"center"}>
          <Stack spacing={4} w={"full"} maxW={"md"}>
            <Heading fontSize={"2xl"}>User Log In/Registration</Heading>
            <FormControl id="email">
              <FormLabel>Organisation Email ID</FormLabel>
              <Input type="email" />
            </FormControl>

            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "column" }}
                align={"start"}
                justify={"space-between"}
              >
                <Text>Terms and Conditions</Text>
                <Text>
                  Read and accept the Terms and Conditions before you proceed.
                </Text>
                <Checkbox>Agree and proceed</Checkbox>
              </Stack>
              <Button
                colorScheme={"blue"}
                variant={"solid"}
                onClick={() => {
                  localStorage.setItem("token", "true");
                  navigate(0);
                }}
              >
                Log in
              </Button>
              <Button colorScheme={"blue"} variant={"outline"}>
                Don’t Have An Account? Register Now
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </Stack>
    </Layout>
  );
}
