import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  OrderedList,
  ListItem,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const ModalShow = ({ show, close }: { show: boolean; close: () => void }) => {
  const { t } = useTranslation();
  const terms = t("REGISTER_ACCEPT_AND_TERMS", {
    returnObjects: true,
  }) as Record<string, string>;

  return (
    <Modal isOpen={show} onClose={close} size="xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Terms & Conditions</ModalHeader>
        <ModalBody maxHeight="400px" overflowY="auto">
          <OrderedList spacing={3}>
            {Object.values(terms).map(([key, term]) => (
              <ListItem key={key}>
                <p>{term}</p>
              </ListItem>
            ))}
          </OrderedList>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={close}>
            {t("REGISTER_TERMS_ACCEPT_BUTTON")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ModalShow;
