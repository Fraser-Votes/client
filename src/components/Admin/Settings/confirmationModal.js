import {
  Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
} from '@chakra-ui/core';
import React, { useState } from 'react';

const ConfirmationModal = ({
  isOpen, title, body, actionName, confirmPassword, onClose, onConfirm, actionLoading,
}) => {
  const [password, setPassword] = useState('');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent maxHeight="85vh" borderRadius="6px">
        <ModalHeader fontWeight="bold" color="blueGray.900">
          {title}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody overflowY="auto">
          {body}
          <Input
            color="blueGray.700"
            borderRadius="6px"
            borderColor="#D9E2EC"
            fontWeight="600"
            placeholder={confirmPassword}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mt="16px"
          />
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} variantColor="gray" mr="16px">
            Cancel
          </Button>
          <Button disabled={password !== confirmPassword} onClick={onConfirm} variantColor="red" isLoading={actionLoading}>
            {actionName || 'Delete'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
