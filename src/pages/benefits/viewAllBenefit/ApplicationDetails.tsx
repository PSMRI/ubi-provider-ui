import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import Layout from "../../../components/layout/Layout";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";

const appData = [
  {
    name: "Namita",
    applicationId: 1,

    deadline: "1970-01-01",
    status: "Active",
  },
  {
    name: "Vidya",
    applicationId: 2,

    deadline: "1970-01-01",
    status: "Draft",
  },
];
const detailData = [
  {
    name: "Namita",
    applicationId: 1,
    gender: "Female",
    age: 12,
    class: 10,
    marks: 90,
  },
  {
    name: "Vidya",
    applicationId: 2,
    gender: "Female",
    age: 12,
    class: 10,
    marks: 90,
  },
];

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const matchedDetail = detailData.find(
    (detail) => detail.applicationId === Number(id)
  );
  const applicantDetail = appData.find(
    (detail) => detail.applicationId === Number(id)
  );
  const fieldsToDisplay: {
    label: string;
    key: keyof (typeof detailData)[0];
  }[] = [
    { label: "Full Name", key: "name" },
    { label: "Gender", key: "gender" },
    { label: "Age", key: "age" },
    { label: "Class", key: "class" },
    { label: "Marks", key: "marks" },
  ];
  const applicantionFieldsToDisplay: {
    label: string;
    key: keyof (typeof appData)[0];
  }[] = [
    { label: "Application ID", key: "applicationId" },
    { label: "Status", key: "status" },
  ];
  //   useEffect(() => {
  //     const fetchApplicationData = async () => {
  //       if (id) {
  //         try {
  //           const applicantionDataResponse = await viewApplicationByApplicationId(
  //             Number(id)
  //           );
  //           console.log("applicantionDataResponse===", applicantionDataResponse);
  //         } catch (error) {
  //           console.error(error);
  //         }
  //       } else {
  //         console.error("id is undefined");
  //       }
  //     };
  //     fetchApplicationData();
  //   }, [id]);

  return (
    <Layout
      _titleBar={{
        title: `Applicant Details : ${matchedDetail?.applicationId}`,
      }}
      showMenu={true}
      showSearchBar={true}
      showLanguage={false}
    >
      <VStack spacing="50px" p={"20px"} align="stretch">
        <VStack align="start" spacing={4} p={4} bg="gray.50">
          <HStack
            spacing={8}
            w="100%"
            boxShadow="0px 4px 4px 0px #00000040"
            p="4"
            borderRadius="md"
            bg="white"
          >
            {applicantionFieldsToDisplay?.map((appFeild) => (
              <FormControl key={appFeild.key}>
                <FormLabel>{appFeild.label}</FormLabel>
                <Input
                  value={applicantDetail?.[appFeild.key] ?? ""}
                  isReadOnly
                  variant="unstyled"
                />
              </FormControl>
            ))}
          </HStack>
          <HStack
            spacing={8}
            w="100%"
            boxShadow="0px 4px 4px 0px #00000040"
            p="4"
            borderRadius="md"
            bg="white"
          >
            {fieldsToDisplay.map((field) => (
              <VStack key={field.key} align="start" spacing={2} w="20%">
                <FormControl>
                  <FormLabel>{field.label}</FormLabel>
                  <InputGroup size="md">
                    <Input
                      value={matchedDetail?.[field.key] ?? ""}
                      isReadOnly
                      variant="unstyled"
                    />
                    <InputRightElement>
                      <CheckIcon color="green.500" />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </VStack>
            ))}
          </HStack>
          <Text fontWeight="bold" fontSize={"24px"}>
            Supporting Documents
          </Text>
          <HStack
            spacing={4}
            w="100%"
            boxShadow="0px 4px 4px 0px #00000040"
            p="4"
            borderRadius="md"
            bg="white"
          >
            <FormControl>
              <FormLabel>Certificate Name</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <CheckIcon color="#0037B9" />
                </InputLeftElement>
                <Input
                  color={"#0037B9"}
                  value="Attached Certificate.pdf"
                  isReadOnly
                  variant="unstyled"
                  pl="2.5rem"
                />
              </InputGroup>
            </FormControl>
          </HStack>
          <HStack spacing={4} justifyContent={"center"} w="100%">
            <Button
              leftIcon={<CheckIcon />}
              colorScheme="#3C5FDD"
              bgColor={"#3C5FDD"}
              variant="solid"
              borderRadius={"100px"}
              alignSelf="center"
            >
              <Text fontSize={"14px"}>Approve</Text>
            </Button>

            <Button
              leftIcon={<CloseIcon color={"#C03744"} />}
              colorScheme="#C03744"
              variant="outline"
              borderRadius={"100px"}
              borderColor={"#C03744"}
              alignSelf="center"
              fontSize={"14px"}
            >
              <Text color={"#C03744"} fontSize={"14px"}>
                Reject
              </Text>
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Layout>
  );
};

export default ApplicationDetails;
