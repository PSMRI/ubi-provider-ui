import React from "react";

import "./card.css"; // Import the CSS file
import TH3 from "../typography/TH3";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Stack,
  Box,
  Heading,
} from "@chakra-ui/react";

const commonCard = () => {
  return (
    <Card>
      <CardHeader>
        <TH3 size="md">Client Report</TH3>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Summary
            </Heading>
            <Text pt="2" fontSize="sm">
              View a summary of all your clients over the last month.
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Overview
            </Heading>
            <Text pt="2" fontSize="sm">
              Check out the overview of your clients.
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Analysis
            </Heading>
            <Text pt="2" fontSize="sm">
              See a detailed analysis of all your business clients.
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default commonCard;
