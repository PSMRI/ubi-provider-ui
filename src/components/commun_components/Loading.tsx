import { Center, Spinner } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Center h="100vh" w="100vh">
      <Spinner size="xl" />
    </Center>
  );
};

export default Loading;
