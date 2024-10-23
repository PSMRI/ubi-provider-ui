import { Center, Spinner } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Center
      h="80vh"
      w="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Spinner size="xl" />
    </Center>
  );
};

export default Loading;
