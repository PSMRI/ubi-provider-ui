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
  return (
    <Modal isOpen={show} onClose={close} size="xl" closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Terms & Conditions</ModalHeader>
        <ModalBody maxHeight="400px" overflowY="auto">
          <OrderedList spacing={3}>
            <ListItem>
              Accuracy of Information
              <p>{t("ACCEPT_AND_TERMS_1")}</p>
            </ListItem>
            <ListItem>
              Compliance with Legal and Regulatory Requirements
              <p>{t("ACCEPT_AND_TERMS_2")}</p>
            </ListItem>
            <ListItem>
              Fund Allocation and Availability
              <p>{t("ACCEPT_AND_TERMS_3")}</p>
            </ListItem>
            <ListItem>
              Timely Updates
              <p>{t("ACCEPT_AND_TERMS_4")}</p>
            </ListItem>
            <ListItem>
              Communication and Support
              <p>{t("ACCEPT_AND_TERMS_5")}</p>
            </ListItem>
            <ListItem>
              Non-Discrimination
              <p>{t("ACCEPT_AND_TERMS_6")}</p>
            </ListItem>

            <ListItem>
              Confidentiality
              <p>{t("ACCEPT_AND_TERMS_7")}</p>
            </ListItem>
            <ListItem>
              Amendments
              <p>{t("ACCEPT_AND_TERMS_8")}</p>
            </ListItem>
            <ListItem>
              Acceptance of Terms
              <p>{t("ACCEPT_AND_TERMS_9")}</p>
            </ListItem>
          </OrderedList>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={close}>
            {t("TERMS_ACCEPT")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default ModalShow;
