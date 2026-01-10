/* eslint-disable react-refresh/only-export-components */
import React from "react";
import Modal from "../../components/Modal";
import { ModalContentRenderer } from "../../components/Modal/ModalContentRenderer";
import { getModalTitle } from "../../utils/modalHelpers";
import type { Booking, Property } from "../../types";

export type ModalContent =
  | { type: "create-booking"; property: Property }
  | { type: "view-booking"; booking: Booking }
  | { type: "edit-booking"; booking: Booking };

type ModalContext = {
  isOpen: boolean;
  content: ModalContent | null;
  openModal: (content: ModalContent) => void;
  closeModal: () => void;
};

const ModalContext = React.createContext<ModalContext | undefined>(undefined);

const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [content, setContent] = React.useState<ModalContent | null>(null);

  const openModal = (modalContent: ModalContent) => {
    setContent(modalContent);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <ModalContext.Provider value={{ isOpen, content, openModal, closeModal }}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={content ? getModalTitle(content) : ""}
      >
        {content && <ModalContentRenderer content={content} />}
      </Modal>
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContext => {
  const context = React.useContext(ModalContext);

  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};

export default ModalProvider;
