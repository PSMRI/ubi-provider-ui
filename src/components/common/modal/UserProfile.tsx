import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Avatar,
  Divider,
  Badge,
  Box,
  Icon,
} from "@chakra-ui/react";
import { FiUser, FiMail, FiShield } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, getUserDisplayName, getUserOrganization } = useAuth();

  if (!user) {
    return null;
  }

  const userName = getUserDisplayName();
  const userOrg = getUserOrganization();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>User Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Avatar and Name Section */}
            <VStack spacing={3}>
              <Avatar
                size="xl"
                name={userName}
                bg="#06164B"
                color="white"
                fontSize="2xl"
              />
              <VStack spacing={1}>
                <Text fontSize="xl" fontWeight="semibold" color="gray.800">
                  {userName}
                </Text>
                {userOrg && (
                  <Badge bg="#06164B" color="white" px={3} py={1}>
                    {userOrg}
                  </Badge>
                )}
              </VStack>
            </VStack>

            <Divider />

            {/* User Details */}
            <VStack spacing={4} align="stretch">
              {/* Full Name */}
              <Box>
                <HStack spacing={3} mb={2}>
                  <Icon as={FiUser} color="gray.500" boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Full Name
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.800" pl={7}>
                  {user.firstname} {user.lastname}
                </Text>
              </Box>

              {/* Email */}
              <Box>
                <HStack spacing={3} mb={2}>
                  <Icon as={FiMail} color="gray.500" boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Email Address
                  </Text>
                </HStack>
                <Text fontSize="md" color="gray.800" pl={7}>
                  {user.email}
                </Text>
              </Box>

              {/* Role/Organization */}
              <Box>
                <HStack spacing={3} mb={2}>
                  <Icon as={FiShield} color="gray.500" boxSize={4} />
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Role / Organization
                  </Text>
                </HStack>
                <HStack spacing={2} pl={7}>
                  {user.s_roles.map((role, index) => (
                    <Badge key={index} borderColor="#06164B" color="#06164B" variant="outline">
                      {role}
                    </Badge>
                  ))}
                </HStack>
              </Box>


            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button bg="#06164B" color="white" _hover={{ bg: "#051244" }} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserProfile; 