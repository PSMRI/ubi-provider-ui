import React from "react";
import { Box, Text } from "@chakra-ui/react";

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
    <Box
      width="340px"
      height="120px"
      padding="20px 0 0 0"
      borderRadius="6px 0px 0px 0px"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="md"
      bg="white"
      gap="12px"
    >
      <Text fontSize="16px" fontWeight="bold">
        {title}
      </Text>
      <Text fontSize="14px">Total Applications: {totalApplications}</Text>
      <Text fontSize="14px">Total Amount Disbursed: ₹ {totalDisbursed}</Text>
    </Box>
  );
};

export default CommonCard;
