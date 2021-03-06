import React, { Component } from 'react';
import {
  Box, Text, Grid, Switch, useToast, Button, Icon, PseudoBox, InputGroup, InputRightAddon, Input, Skeleton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
} from '@chakra-ui/core';
import firebase from 'gatsby-plugin-firebase';
import { withPrefix } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../Layout';
import { IsMobile } from '../../utils/mediaQueries';
import { chunk, snapshotMap } from '../../utils/helpers';
import AdminSEO from '../adminSEO';
import { getUser } from '../../utils/auth';
import ManageUsersDrawer from './Settings/manageUsers';
import ConfirmationModal from './Settings/confirmationModal';

const ToastContext = React.createContext(() => { });
const ToastProvider = ({ children }) => {
  const toast = useToast();
  return <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>;
};

const Header = ({ title }) => (
  <Box
    mt={IsMobile() ? '46px' : '12px'}
    h="76px"
    display="flex"
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
  >
    <Text fontSize="2xl" fontWeight="bold" color="blueGray.900">
      {title}
    </Text>
  </Box>
);

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

const FileCard = ({ name, size, removeKeyFile }) => (
  <Box
    px="10px"
    py="10px"
    backgroundColor="white"
    border="1.5px solid rgba(217, 226, 236, 0.6)"
    borderRadius="12px"
    maxWidth="300px"
    display="flex"
    flexDirection="row"
    alignItems="center"
  >
    <Icon size="45px" name="document" />
    <Box
      fontSize="16px"
      fontWeight="600"
      lineHeight="20px"
      ml="12px"
    >
      <Text isTruncated maxWidth="150px" color="blueGray.900">
        {name}
      </Text>
      <Text color="blueGray.500">
        {size}
        {' '}
        bytes
      </Text>
    </Box>
    <PseudoBox as="button" onClick={removeKeyFile} ml="auto">
      <Icon borderRadius="2000px" backgroundColor="blue.50" px="6px" py="6px" size="26px" color="blue.800" name="close" />
    </PseudoBox>
  </Box>
);

const NeutralButton = ({ onClick, text, isLoading }) => (
  <Button
    onClick={onClick}
    _hover={{ bg: 'rgba(220, 238, 251, 0.5);' }}
    backgroundColor="blue.50"
    color="blue.800"
    px="18px"
    py="12px"
    mr="16px"
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

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      votingOpen: false,
      loading: true,
      keyPairExists: false,
      keyFileURL: null,
      privateKey: null,
      fileName: null,
      fileSize: null,
      isCounting: false,
      votes: null,
      adminEmail: null,
      settingAdmin: false,
      loadingAdmins: false,
      admins: [],
      adminModalOpen: false,
      manageUsersDrawer: {
        open: false,
      },
      isDeleteBallotsModalOpen: false,
      deletingBallots: false,
    };
  }

  setIsDeleteBallotsModalOpen = (isOpen) => {
    this.setState({
      isDeleteBallotsModalOpen: isOpen
    })
  }

  componentDidMount() {
    this.hydrateWithFirebase();
    this.keyUploadRef = React.createRef(null);
  }

  verifyVotingClosed = (toast) => {
    if (this.state.votingOpen) {
      toast({
        title: 'Voting must be closed',
        description: 'Voting must be closed to count votes',
        status: 'warning',
        duration: 10000,
        isClosable: true,
      });
    } else {
      this.countVotes(toast);
    }
  }

  decrypt = async (encrypted) => {
    const { openpgp } = window;
    const privKeyObj = (await openpgp.key.readArmored(this.state.privateKey)).keys[0];
    const options = {
      message: await openpgp.message.readArmored(encrypted),
      privateKeys: [privKeyObj],
    };

    const { data } = await openpgp.decrypt(options);
    return data;
  };

  countVotes = async (toast) => {
    this.setState({
      isCounting: true,
    });

    const votes = {};
    const db = firebase.firestore();
    const positionData = {};

    try {
      const snapshot = await db.collection('ballots').get();
      const positions = await db.collection('positions').get();
      positions.forEach(position => {
        positionData[position.id] = position.data().numWinners || 1
      });

      await snapshotMap(snapshot, async (doc) => Promise.all(
        Object.keys(doc.data().votes).map(async (key) => {
          const vote = doc.data().votes[key];
          const decryptedVote = (await this.decrypt(vote)).split(','); // array
          decryptedVote.forEach((vote) => {
            if (positionData[key] < 2) {
              decryptedVote.shift();
            }
            if (votes[key]) {
              if (votes[key][vote]) {
                votes[key][vote]++;
              } else {
                votes[key][vote] = 1;
              }
            } else {
              votes[key] = {};
              votes[key][vote] = 1;
            }
          });
        }),
      ));

      await db.collection('election').doc('voting').update({ votesCounted: true });
      await db.collection('election').doc('results').set(votes);
      this.setState({
        isCounting: false,
        votes,
      }, () => {
        toast({
          title: 'Votes counted',
          description: 'Please go to the results page.',
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
      });
    } catch (err) {
      this.setState({
        isCounting: false,
      }, () => {
        toast({
          title: 'Something went wrong',
          description: 'Please try again',
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
        console.log('Error counting votes:', err);
      });
    }

    this.setState({
      isCounting: false,
      votes,
    });
  }

  removeKeyFile = () => {
    this.keyUploadRef.current.value = null;
    this.setState({
      keyFileURL: null,
      fileName: null,
      fileSize: null,
      privateKey: null,
    });
  }

  uploadKeyFile = () => {
    this.keyUploadRef.current.click();
  }

  onKeyFileChange = (e) => {
    // prevent default form actions
    e.stopPropagation();
    e.preventDefault();

    // create a new file reader
    const reader = new FileReader();
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);

    reader.onload = (fileLoadedEvent) => {
      const textFromFileLoaded = fileLoadedEvent.target.result;
      this.setState({
        privateKey: textFromFileLoaded,
        keyFileURL: fileURL,
        fileName: file.name,
        fileSize: file.size,
      });
    };

    reader.readAsText(file);
  }

  changeVotingOpen = (e, toast) => {
    const { checked } = e.target;
    firebase
      .firestore()
      .collection('election')
      .doc('voting')
      .update({
        open: checked,
      })
      .then(() => {
        this.setState({
          votingOpen: checked,
        });
      })
      .catch((err) => {
        toast({
          title: 'Something went wrong with opening voting',
          description: err,
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
      });
  }

  hydrateWithFirebase = async () => {
    const db = firebase.firestore();

    // get the current voting open state -> apply to switch
    let votingOpenState = await db.collection('election').doc('voting').get();
    votingOpenState = votingOpenState.data().open;

    let publicKeyExists = await db.collection('admin').doc('keys').get();
    publicKeyExists = publicKeyExists.exists;

    this.setState({
      votingOpen: votingOpenState,
      keyPairExists: publicKeyExists,
      loading: false,
    });
  }

  handleInputChange = (event) => {
    this.setState({
      adminEmail: event.target.value,
    });
  }

  addAdmin = async (toast) => {
    try {
      this.setState({
        settingAdmin: true,
      });

      await firebase.firestore().collection('users').doc(this.state.adminEmail).update({
        admin: true,
      });

      toast({
        title: 'Added Admin',
        description: `${this.state.adminEmail} is now an admin.`,
        status: 'success',
        duration: 10000,
        isClosable: true,
      });

      this.setState({
        adminEmail: '',
        settingAdmin: false,
      });
    } catch (err) {
      console.log('Error creating admin: ', err);

      this.setState({
        settingAdmin: false,
      });

      if (err.code === 'not-found') {
        toast({
          title: "User doesn't exist",
          description: 'Please add the user first.',
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error Adding Admin',
          description: 'Please try again',
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
      }
    }
  }

  viewAdmins = async () => {
    const db = firebase.firestore();

    this.setState({
      loadingAdmins: true,
    });

    const adminSnapshot = await db.collection('users').where('admin', '==', true).get();
    const admins = [];
    adminSnapshot.forEach((admin) => {
      admins.push(admin.id);
    });
    this.setState({
      admins,
      loadingAdmins: false,
      adminModalOpen: true,
    });
  }

  removeAdmin = async (toast, admin) => {
    try {
      await firebase.firestore().collection('users').doc(admin).update({
        admin: false,
      });
      this.setState((prevState) => ({
        admins: prevState.admins.filter((adminID) => adminID !== admin),
      }));
      toast({
        title: 'Removed admin',
        description: admin,
        status: 'success',
        duration: 10000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: 'Something went wrong with removing an admin',
        description: err,
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    }
  }

  generateAdminModalCards = (toast) => this.state.admins.map((admin) => {
    if (admin !== getUser().email.split('@')[0]) {
      return (
        <Box
          display="flex"
          flexDirection="row"
          h="48px"
          w="100%"
          mb="16px"
          px="16px"
          backgroundColor="white"
          borderRadius="6px"
          alignItems="center"
          boxShadow="0px 2.08325px 5.34398px rgba(0, 0, 0, 0.0174206), 0px 5.75991px 14.7754px rgba(0, 0, 0, 0.025), 0px 13.8677px 35.5735px rgba(0, 0, 0, 0.0325794), 0px 46px 118px rgba(0, 0, 0, 0.05);"
        >
          <Text
            fontWeight="600"
            fontSize="16px"
            color="blueGray.700"
          >
            {admin}
          </Text>
          <PseudoBox as="button" onClick={() => this.removeAdmin(toast, admin)} ml="auto">
            <Icon
              color="blueGray.700"
              size="20px"
              mt="-2px"
              name="trash"
            />
          </PseudoBox>
        </Box>
      );
    }
  })

  deleteBallots = async (toast) => {
    console.log('deleting ballots')
    this.setState({ deletingBallots: true })
    try {
      const documents = await firebase.firestore().collection('ballots').get();
      const batches = chunk(documents.docs, 500).map((ballotDocs) => {
        const batch = firebase.firestore().batch();
        ballotDocs.forEach((doc) => {
          batch.delete(firebase.firestore().collection('ballots').doc(doc.id))
        });

        return batch.commit();
      });
      await Promise.all(batches);
      this.setState({ deletingBallots: false, isDeleteBallotsModalOpen: false });
      toast({
        title: 'Deleted all ballots',
        status: 'success',
        duration: 10000,
        isClosable: true
      })

    } catch (e) {
      console.error(e);
      toast({
        title: 'Error deleting ballots',
        description: JSON.stringify(e),
        status: 'error',
        duration: 10000,
        isClosable: true
      })
      this.setState({ deletingBallots: false, isDeleteBallotsModalOpen: false });
    }
  }

  render() {
    return (
      <Layout>
        <AdminSEO title="Settings" />
        <Header title="Settings" />
        <Helmet>
          <script defer src={withPrefix('../js/openpgp.min.js')} />
          <script
            defer
            src={withPrefix('../js/openpgp.worker.min.js')}
          />
        </Helmet>
        <Grid mb="40px" gridTemplateRows="auto fit-content(50%) auto">
          {this.state.loading ? (
            <>
              <Skeleton mb="16px" width="120px" height="24px" borderRadius="8px" />
              <Skeleton mb="16px" width="200px" height="20px" borderRadius="8px" />
              <Skeleton width="300px" height="40px" borderRadius="8px" />
            </>
          ) : (
            <ToastProvider>
              <ToastContext.Consumer>
                {(toast) => (
                  <>
                    <Box mb="32px">
                      <SettingHeader
                        title="Voting"
                        badge={this.state.votingOpen ? 'Open' : 'Closed'}
                        description="Voting must be closed in order for votes to be counted."
                        badgeStatus={this.state.votingOpen}
                      />
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                      >
                        <Switch
                          onChange={(e) => this.changeVotingOpen(e, toast)}
                          isChecked={this.state.votingOpen}
                          color="teal"
                          size="md"
                        />
                        <Text
                          mt="-4px"
                          ml="12px"
                          color="blueGray.900"
                          fontWeight="600"
                          fontSize="16px"
                        >
                          Open Voting
                        </Text>
                      </Box>
                    </Box>
                    <Box mb="32px">
                      <SettingHeader
                        title="Count Votes"
                        description="Please select this election’s private key. This is required in order to decrypt and count all the ballots. Your key will never be uploaded to our servers."
                      />
                      <input
                        onChange={this.onKeyFileChange}
                        type="file"
                        ref={this.keyUploadRef}
                        accept=".asc"
                        style={{ display: 'none' }}
                      />
                      {this.state.privateKey ? (
                        <>
                          <FileCard
                            name={this.state.fileName}
                            size={this.state.fileSize}
                            removeKeyFile={this.removeKeyFile}
                          />
                          <Text fontWeight="600" fontSize="16px" color="blueGray.400" mt="16px">
                            This process could take several minutes.
                            Please do not leave this webpage.
                          </Text>
                          <Button
                            mt="12px"
                            onClick={() => this.verifyVotingClosed(toast)}
                            _hover={{ bg: 'rgba(220, 238, 251, 0.5);' }}
                            backgroundColor="blue.50"
                            color="blue.800"
                            px="18px"
                            py="12px"
                            borderRadius="8px"
                            isLoading={this.state.isCounting}
                          >
                            Count Votes
                          </Button>
                        </>
                      ) : (
                        <NeutralButton onClick={this.uploadKeyFile} text="Select Key" />
                      )}
                    </Box>
                    <Box mb="32px">
                      <SettingHeader
                        title="Add Administrator"
                        description="This will allow them to view the Admin section of this app and edit all settings. They must have a pdsb.net email to be added."
                      />
                      <InputGroup mb="16px" maxWidth="400px">
                        { /* eslint-disable-next-line react/no-children-prop */ }
                        <InputRightAddon fontWeight="600" backgroundColor="blue.50" color="blue.700" roundedRight="8px" children="@pdsb.net" />
                        <Input value={this.state.adminEmail} onChange={this.handleInputChange} color="blueGrey.500" fontWeight="600" roundedLeft="8px" placeholder="Email" />
                      </InputGroup>
                      <NeutralButton isLoading={this.state.settingAdmin} onClick={() => this.addAdmin(toast)} text="Add Admin" />
                      <NeutralButton isLoading={this.state.loadingAdmins} onClick={() => this.viewAdmins()} text="View Admins" />
                    </Box>
                    <Box>
                      <SettingHeader
                        title="Manage Election"
                        description="Use this section to start new elections and manage users."
                        badge="Danger Zone"
                      />
                      <NeutralButton text="New Election" />
                      <NeutralButton text="Manage Users" onClick={() => this.setState({ manageUsersDrawer: { open: true } })} />
                      <DangerButton text="Delete All Ballots" onClick={() => this.setState({ isDeleteBallotsModalOpen: true })} />
                    </Box>
                    <Modal
                      isOpen={this.state.adminModalOpen}
                      onClose={() => this.setState({
                        adminModalOpen: false,
                      })}
                    >
                      <ModalOverlay />
                      <ModalContent backgroundColor="blueGray.50" maxHeight="85vh" borderRadius="12px">
                        <ModalHeader fontWeight="bold" color="blueGray.900">
                          Election Administrators
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody overflowY="auto">
                          {this.generateAdminModalCards(toast)}
                        </ModalBody>
                        <ModalFooter display="flex" flexDir="row" alignItems="center" justifyContent="center" />
                      </ModalContent>
                    </Modal>
                    <ManageUsersDrawer toast={toast} isOpen={this.state.manageUsersDrawer.open} onClose={() => this.setState({ manageUsersDrawer: { open: false } })} />
                    <ConfirmationModal
                      isOpen={this.state.isDeleteBallotsModalOpen}
                      onClose={() => this.setIsDeleteBallotsModalOpen(false)}
                      actionName="Delete All Ballots"
                      confirmPassword="delete all ballots"
                      onConfirm={() => this.deleteBallots(toast)}
                      title="Confirm Deletion of all Ballots"
                      actionLoading={this.state.deletingBallots}
                      body={(
                        <Text>
                          Type
                          <Text as="span" fontWeight="bold">
                            {' '}
                            delete all ballots
                            {' '}
                          </Text>
                          into the field below to confirm this action.
                          Please do this after you have counted all the votes, as the ballots will not be recoverable.
                        </Text>
                      )}
                    />
                  </>
                )}
              </ToastContext.Consumer>
            </ToastProvider>
          )}
        </Grid>
      </Layout>
    );
  }
}
