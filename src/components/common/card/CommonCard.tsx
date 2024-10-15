import React from "react";
<<<<<<< HEAD
import { Box, Text } from "@chakra-ui/react";
=======
import { VStack, Text } from "@chakra-ui/react";
>>>>>>> c0caff62d24c1c03ec471d0bdf592146c283b794

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
      spasing="3"
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
