import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

interface ModalProps {
  isOpen: boolean | undefined;
  onClose: () => void;
  title: string;
  description: string;
  children: React.ReactNode;
}
export default function CustomModal({isOpen,onClose,title,description,children}:ModalProps) {


  return (
    <>
    <Modal backdrop="blur" isOpen={isOpen} onClose={() => onClose()}>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1 text-accent">
          {title}
        </ModalHeader>
        <ModalBody>
          <p className="text-secondary">{description}</p>
        </ModalBody>
        <ModalFooter>{children}</ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>


    </>
  );
}

