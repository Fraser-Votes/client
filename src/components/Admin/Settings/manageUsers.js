import React, { useEffect, useState } from 'react';
import firebase from 'gatsby-plugin-firebase';
import {
  Box, Textarea, InputGroup, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Text, PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow, Popover, PopoverCloseButton, PopoverBody, PopoverFooter,
} from '@chakra-ui/core';
import { IsDesktop } from '../../../utils/mediaQueries';
import ConfirmationModal from './confirmationModal';
import { asyncForEach } from '../../../utils/helpers';

const chunk = (arr, chunkSize) => {
  // eslint-disable-next-line no-throw-literal
  if (chunkSize <= 0) throw 'Invalid chunk size';
  const R = [];
  for (let i = 0, len = arr.length; i < len; i += chunkSize) R.push(arr.slice(i, i + chunkSize));
  return R;
};

const SettingHeader = ({
  title, description, badge, badgeStatus,
}) => (
  <Box mb="16px">
    <Box display="flex" flexDirection="row" alignItems="center" mb="8px">
      <Text fontSize="20px" color="blueGray.900" fontWeight="bold">
        {title}
      </Text>
      {badge
        ? (
          <Text
            py="3px"
            px="12px"
            ml="12px"
            mt="2px"
            borderRadius="14px"
            backgroundColor={badgeStatus ? 'teal.100' : 'red.100'}
            color={badgeStatus ? 'teal.700' : 'red.700'}
            fontWeight="bold"
            fontSize="14px"
          >
            {badge}
          </Text>
        )
        : <></>}
    </Box>
    <Text fontWeight="600" fontSize="16px" color="blueGray.400">
      {description}
    </Text>
  </Box>
);

const NeutralButton = ({
  disabled, onClick, text, isLoading,
}) => (
  <Button
    onClick={onClick}
    _hover={{ bg: 'rgba(220, 238, 251, 0.5);' }}
    backgroundColor="blue.50"
    color="blue.800"
    px="18px"
    py="12px"
    mr="16px"
    disabled={disabled}
    borderRadius="8px"
    isLoading={isLoading}
  >
    {text}
  </Button>
);

const DangerButton = ({ onClick, text, isLoading }) => (
  <Button
    onClick={onClick}
    _hover={{ bg: 'rgba(250, 205, 205, 0.75);' }}
    backgroundColor="red.100"
    color="red.700"
    px="18px"
    py="12px"
    mr="16px"
    borderRadius="8px"
    isLoading={isLoading}
  >
    {text}
  </Button>
);

const usersPlaceholder = `629204
655253
758264
642589
`;

const ManageUsersDrawer = ({ isOpen, onClose, toast }) => {
  const [newUsers, setNewUsers] = useState('');
  const [addingUsers, setAddingUsers] = useState(false);
  const [deletingUsers, setDeletingUsers] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const handleNewUsers = (e) => setNewUsers(e.target.value);

  const addUsers = async () => {
    const usersCollection = firebase.firestore().collection('users');
    const userInfo = {
      voted: false,
    };

    setAddingUsers(true);

    // get array of users
    const usersArray = newUsers.split('\n').filter((user) => user !== '');
    console.log(usersArray);
    const asdf = (await usersCollection.get()).docs;
    console.log(asdf);
    try {
      // iterate through array and add a batch write
      const batches = chunk(usersArray, 500).map((userChunk) => {
        const batch = firebase.firestore().batch();
        userChunk.forEach((user) => {
          const userRef = usersCollection.doc(user);
          batch.set(userRef, userInfo, { merge: true });
        });

        return batch.commit();
      });

      await Promise.all(batches);

      toast({
        title: `Added ${usersArray.length} users`,
        status: 'success',
        duration: 10000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error adding users',
        description: err,
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    }

    setAddingUsers(false);
  };

  // yikes
  const deleteUsers = async () => {
    setIsConfirmationModalOpen(false);
    setDeletingUsers(true);
    try {
      const documents = await firebase.firestore().collection('users').where('admin', '!=', true).get();
      const batches = chunk(documents.docs, 500).map((userDocs) => {
        const batch = firebase.firestore().batch();
        userDocs.forEach((doc) => {
          batch.delete(firebase.firestore().collection('users').doc(doc.id));
        });

        return batch.commit();
      });

      await Promise.all(batches);
      setDeletingUsers(false);
      toast({
        title: 'Deleted all non-admin users',
        status: 'success',
        duration: 10000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: 'Error deleting users',
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={() => {
          onClose();
        }}
        size={IsDesktop() ? 'lg' : 'full'}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader color="blue.900" borderBottomWidth="1px">
            Manage Users
          </DrawerHeader>
          <DrawerBody overflowY="scroll">
            <Box mt="16px" mb="32px">
              <SettingHeader
                title="Add User(s)"
                description="Manually add new user(s) using their student number. Each individual user should be on it's own line. Any added user will be able to cast a vote - if they have already been added, they will be able to vote again. Please do not leave the page until all users have been added."
              />
              <InputGroup mb="16px">
                <Textarea
                  value={newUsers}
                  onChange={handleNewUsers}
                  color="blueGrey.500"
                  fontWeight="600"
                  borderRadius="8px"
                  placeholder={usersPlaceholder}
                  width="100%"
                  minHeight="200px"
                />
              </InputGroup>
              <NeutralButton disabled={newUsers.length < 1} onClick={addUsers} isLoading={addingUsers} text="Add User(s)" />
            </Box>
            <Box mt="16px" mb="32px">
              <SettingHeader
                title="Delete Users"
                description="Removes all users that are not administrators"
              />
              <DangerButton onClick={() => setIsConfirmationModalOpen(true)} isLoading={deletingUsers} text="Delete All Users" />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        actionName="Delete Users"
        confirmPassword="delete users"
        onConfirm={deleteUsers}
        title="Confirm User Deletion"
        body={(
          <Text>
            Type
            <Text as="span" fontWeight="bold">
              {' '}
              delete users
              {' '}
            </Text>
            into the field below to confirm this action.
          </Text>
)}
      />
    </>
  );
};

export default ManageUsersDrawer;
