import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from "@chakra-ui/react";

const AlertMessage = ({
  message,
  show,
  close,
}: {
  message: string;
  show: boolean;
  close: () => void;
}) => {
  return (
    <Modal isOpen={show} onClose={close} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Message</ModalHeader>
        <ModalBody>{message}</ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={close}>
            Okay
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default AlertMessage;
