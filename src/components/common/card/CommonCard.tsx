import React from "react";
import { VStack, Text } from "@chakra-ui/react";

interface CommonCardProps {
  title: string;
  totalApplications: number;
  totalDisbursed: string;
}

const CommonCard: React.FC<CommonCardProps> = ({
  title,
  totalApplications,
  totalDisbursed,
}) => {
  return (
    <VStack
      align="stretch"
      p="5"
      rounded="6"
      boxShadow="md"
      bg="#f8f8f8"
      spacing="3"
    >
      <Text fontSize="16px" fontWeight="bold">
        {title}
      </Text>
      <Text fontSize="14px">Total Applications: {totalApplications}</Text>
      <Text fontSize="14px">Total Amount Disbursed: ₹ {totalDisbursed}</Text>
    </VStack>
  );
};

export default CommonCard;
