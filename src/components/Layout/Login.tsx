import {
  Button,
  Checkbox,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Image,
  HStack,
  VStack,
} from "@chakra-ui/react";
import Logo from "../../assets/Images/GOM.png";
export default function Login() {
  return (
    <Stack minH={"100vh"} direction={{ base: "column", md: "row" }}>
      <Flex flex={1} backgroundColor={"#121943"} w={"50%"}>
        {/* Left */}
        <Stack>
          <HStack>
            <Image src={Logo} />
            <VStack>
              <Text color={"#FFFFFF"}>Universal Benefits Platform</Text>
              <Text color={"#FFFFFF"}>Official Use Only</Text>
              <Text color={"#FFFFFF"}>
                Welcome to the Benefit creation platform
              </Text>
            </VStack>
          </HStack>
        </Stack>
      </Flex>
      <Flex p={8} flex={1} align={"center"} justify={"center"}>
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
            <Button colorScheme={"blue"} variant={"solid"}>
              Log in
            </Button>
            <Button colorScheme={"blue"} variant={"outline"}>
              Don’t Have An Account? Register Now
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
}
