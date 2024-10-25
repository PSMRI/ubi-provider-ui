import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const ModalShow = ({ show, close }: { show: boolean; close: () => void }) => {
  const { t } = useTranslation();

  const termsHtml = t("REGISTER_ACCEPT_AND_TERMS_HTML");

  return (
    <Modal isOpen={show} onClose={close} size="xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Terms & Conditions</ModalHeader>
        <ModalBody maxHeight="400px" overflowY="auto">
          {/* Render HTML from the language file */}
          <div dangerouslySetInnerHTML={{ __html: termsHtml }} />
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
