import React, { Component } from 'react';
import {
  Text, Box, Skeleton, Grid, Checkbox, Image, Button,
  Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalFooter, ModalHeader,
  useToast,
} from '@chakra-ui/core';
import firebase from 'gatsby-plugin-firebase';
import Helmet from 'react-helmet';
import { withPrefix } from 'gatsby';
import Layout from './Layout';
import Header from './Header';
import SEO from './seo';
import { IsDesktop } from '../utils/mediaQueries';
import PlaceholderImage from '../images/placeholder.jpg';
import { getUser } from '../utils/auth';
import { snapshotMap } from '../utils/helpers';

const ToastContext = React.createContext(() => { });

function ToastProvider({ children }) {
  const toast = useToast();
  return (
    <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
  );
}

const CandidateRow = ({ position, numWinners, children }) => (
  <Box mb="32px">
    <Text
      fontSize="xl"
      fontWeight="bold"
      color="blueGray.900"
      textTransform="capitalize"
      mb={numWinners > 1 ? 0 : "18px"}
    >
      {position.replaceAll('-', ' ')}
    </Text>
    {numWinners > 1 && (
      <Text
        fontSize="16px"
        fontWeight="600"
        color="blueGray.500"
        mb="18px"
      >
        Select up to {numWinners} candidates
      </Text>
    )}
    <Grid gridTemplateColumns={IsDesktop() ? 'repeat(auto-fill, 310px)' : '1fr'} gridColumnGap="24px" gridRowGap="24px">
      {children}
    </Grid>
  </Box>
);

const CandidateCard = ({
  first, last, position, photoURL, onChecked, isDisabled, voted, currentSelection, votingClosed, id, numWinners, numSelected,
}) => {
  const included = currentSelection.includes(id);
  const currSelect = included;
  const tempDisable = !included && numWinners === numSelected && numWinners > 1;

  return (
    <Box
      display="flex"
      flexDirection="row"
      h="60px"
      w="100%"
      backgroundColor="white"
      borderRadius="12px"
      alignItems="center"
      boxShadow={currSelect ? '' : '0px 2.08325px 5.34398px rgba(0, 0, 0, 0.0174206), 0px 5.75991px 14.7754px rgba(0, 0, 0, 0.025), 0px 13.8677px 35.5735px rgba(0, 0, 0, 0.0325794), 0px 46px 118px rgba(0, 0, 0, 0.05);'}
      cursor="pointer"
      key={id}
    >
      <Image objectFit="cover" ml="12px" mr="20px" borderRadius="12px" w="40px" h="40px" src={photoURL} fallbackSrc={PlaceholderImage} />
      <Text
        fontWeight="600"
        fontSize="16px"
        color="blueGray.700"
        as="a"
        href={`/app/candidates/${id}`}
      >
        {first}
        {' '}
        {last}
      </Text>
      <Checkbox
        onChange={() => { onChecked(position, id, currSelect, first, last, photoURL); }}
        isChecked={currSelect}
        isDisabled={voted || votingClosed || tempDisable}
        variantColor="teal"
        ml="auto"
        mr="12px"
        borderRadius="12px"
        size="lg"
      />
    </Box>
  );
};

const ModalCandidateCard = ({
  position, first, last, photoURL, id,
}) => (
  <Box
    display="flex"
    flexDirection="row"
    h="72px"
    w="100%"
    mb="16px"
    backgroundColor="white"
    borderRadius="12px"
    alignItems="center"
    boxShadow="0px 2.08325px 5.34398px rgba(0, 0, 0, 0.0174206), 0px 5.75991px 14.7754px rgba(0, 0, 0, 0.025), 0px 13.8677px 35.5735px rgba(0, 0, 0, 0.0325794), 0px 46px 118px rgba(0, 0, 0, 0.05);"
    key={id}
  >
    <Image objectFit="cover" ml="16px" mr="24px" borderRadius="12px" w="48px" h="48px" src={photoURL} fallbackSrc={PlaceholderImage} />
    <Box>
      <Text
        fontWeight="600"
        fontSize="16px"
        color="blueGray.700"
        textTransform="capitalize"
      >
        {position.replaceAll('-', ' ')}
      </Text>
      <Text
        fontWeight="600"
        fontSize="16px"
        color="blueGray.500"
        as="a"
        href={first !== 'No Candidate Selected' ? `/app/candidates/${id}` : '#'}
      >
        {`${first} ${last}`}
      </Text>
    </Box>
  </Box>
);

export default class Candidates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: null,
      dataLoading: true,
      validated: false,
      voteError: false,
      voteSubmitting: false,
      voteSuccessful: false,
      voted: false,
      votingEnded: false,
      votingOpen: false,
      votes: {},
      positions: [],
      confirmationOpen: false,
      rawCandidates: {},
      rawPositions: {},
    };
  }

  componentDidMount() {
    this.getCandidates();
    this.getVotingStatus();
    this.getUserVotingStatus();
  }

  createCandidateCards = () => {
    const cards = Object.keys(this.state.votes)?.map((position) => (
      this.state.votes[position].selectedCandidates.length > 0 ? this.state.votes[position].selectedCandidates.map((id) => {
        const candidate = this.state.rawCandidates[id];
        return (
          <ModalCandidateCard
            position={position}
            first={candidate.first}
            last={candidate.last}
            photoURL={candidate.photoURL}
            id={id}
          />
        );
      }) : (
        <ModalCandidateCard
          position={position}
          first="No Candidate Selected"
          last=""
          photoURL=""
          id=""
        />
      )
    ));
    return cards;
  }

  createVote = (position, candidateID, currentlySelected) => {
    // max winners reached and not currently selected
    if (this.state.votes[position].numSelected === this.state.votes[position].numWinners && !currentlySelected && this.state.votes[position].numWinners > 1) {
      this.setState((prevState) => ({
        votes: {
          ...prevState.votes,
          [position]: {
            numSelected: prevState.votes[position].numSelected - 1,
            numWinners: prevState.votes[position].numWinners,
            selectedCandidates: [candidateID],
          },
        },
      }), () => {
        console.log(this.voteValidator());
        this.setState({
          validated: this.voteValidator(),
        });
      });
    }
    else if (this.state.votes[position].numSelected === this.state.votes[position].numWinners && !currentlySelected) {
      this.setState((prevState) => ({
        votes: {
          ...prevState.votes,
          [position]: {
            numSelected: 1,
            numWinners: prevState.votes[position].numWinners,
            selectedCandidates: [candidateID],
          },
        },
      }), () => {
        console.log(this.voteValidator());
        this.setState({
          validated: this.voteValidator(),
        });
      });
    } else {
      this.setState((prevState) => ({
        votes: {
          ...prevState.votes,
          [position]: {
            numSelected: currentlySelected ? prevState.votes[position].numSelected - 1 : prevState.votes[position].numSelected + 1,
            numWinners: prevState.votes[position].numWinners,
            selectedCandidates: currentlySelected ? prevState.votes[position].selectedCandidates.filter((id) => id !== candidateID) : prevState.votes[position].selectedCandidates.concat(candidateID),
          },
        },
      }), () => {
        console.log(this.voteValidator());
        this.setState({
          validated: this.voteValidator(),
        });
      });
    }
  }

  confirmVote = (toast) => {
    const votesValid = this.voteValidator();
    if (votesValid) {
      this.setState({
        confirmationOpen: true,
      });
    } else {
      toast({
        title: 'No candidates selected',
        description: 'Please select at least one candidate',
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    }
  }

  // TODO: allow incomplete ballot
  voteValidator = () => {
    let validated = false;
    Object.values(this.state.votes).forEach((vote) => {
      if (vote.numSelected > 0) {
        validated = true;
      }
    });
    return validated;
  }

  getPublicKey = async () => {
    const keyDoc = await firebase.firestore().collection('admin').doc('keys').get();
    this.setState({ publicKey: keyDoc.data().public });
  }

  encryptCandidate = async (position) => {
    if (position[1].selectedCandidates.length > 0) {
      const { openpgp } = window;
      await openpgp.initWorker({ path: withPrefix('../js/openpgp.worker.min.js') });
      const res = await openpgp.key.readArmored(this.state.publicKey);
      const { data: encrypted } = await openpgp.encrypt({
        message: openpgp.message.fromText(position[1].selectedCandidates),
        publicKeys: res.keys,
      });
      await new Promise((resolve) => this.setState((prevState) => ({
        parsedVotes: {
          ...prevState.parsedVotes,
          [position[0]]: encrypted,
        },
      }), () => {
        resolve();
      }));
    } else {
      return true;
    }
  }

  submitVote = async (toast) => {
    this.setState({ voteSubmitting: true });
    if (process.env.NODE_ENV === 'development') {
      // firebase.functions().useFunctionsEmulator('http://localhost:5001')
    }
    await this.getPublicKey();
    const functions = firebase.functions();
    const addVote = functions.httpsCallable('vote');
    const ops = Object.entries(this.state.votes)
      .map((position) => this.encryptCandidate(position));
    Promise.all(ops).then(() => {
      const parsedVotes = {};
      Object.keys(this.state.votes).forEach((position) => {
        if (this.state.parsedVotes[position]) {
          parsedVotes[position] = this.state.parsedVotes[position];
        }
      });
      console.log(parsedVotes);
      addVote({ votes: parsedVotes }).then(() => {
        this.setState({
          voteSuccessful: true,
          voteSubmitting: false,
          confirmationOpen: false,
          voted: true,
        });
        window.plausible('Vote');
        toast({
          title: 'Vote Submitted',
          description: 'Thanks for voting!',
          status: 'success',
          duration: 10000,
          isClosable: true,
        });
      }).catch((err) => {
        console.error('error setting vote', err.code, err.message, err.details);
        this.setState({
          voteError: true,
          voteSubmitting: false,
          confirmationOpen: false,
        });
        toast({
          title: 'An error occurred',
          description: 'There was an error submitting your vote. Please try again.',
          status: 'error',
          duration: 10000,
          isClosable: true,
        });
      });
    });
  }

  getUserVotingStatus = async () => {
    const votingStatusRef = await firebase.firestore().collection('users').doc(getUser().email.split('@')[0]).get();
    const votingStatus = votingStatusRef.data().voted;
    this.setState({ voted: votingStatus });
  }

  getVotingStatus = async () => {
    const votingStatusRef = await firebase.firestore().collection('election').doc('voting').get();
    const votingStatus = votingStatusRef.data().open;
    const votingEnded = votingStatusRef.data().hasEnded;
    this.setState({
      votingOpen: votingStatus,
      votingEnded,
    });
  }

  getCandidates = async () => {
    const db = firebase.firestore();
    const candidateRef = db.collection('candidates');
    const candidates = {};
    const rawCandidates = {};

    try {
      const positions = await db.collection('positions').get();
      const positionOrderRef = await db.collection('election').doc('positions').get();
      const positionOrder = positionOrderRef.data().order;

      const votes = {};
      const rawPositions = {};
      positionOrder.forEach((position) => {
        votes[position] = {
          numSelected: 0,
          selectedCandidates: [],
        };
      });

      positions.forEach((position) => {
        votes[position.id].numWinners = position.data().numWinners || 1;
        rawPositions[position.id] = {
          numWinners: position.data().numWinners || 1
        }
      });

      await snapshotMap(positions.docs, async (position) => {
        candidates[position.id] = [];
        const positionDocRef = db.collection('positions').doc(position.id);
        const res = await candidateRef.where('position', '==', positionDocRef).get();
        res.forEach((doc) => {
          candidates[position.id].push({ ...doc.data(), id: doc.id });
          rawCandidates[doc.id] = {
            ...doc.data(),
          };
        });
      });
      this.setState({
        candidates,
        dataLoading: false,
        positions: positionOrder,
        rawPositions,
        votes,
        rawCandidates,
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  render() {
    return (
      <ToastProvider>
        <Layout>
          <Helmet>
            <script defer src={withPrefix('../js/openpgp.min.js')} />
            <script defer src={withPrefix('../js/openpgp.worker.min.js')} />
          </Helmet>
          <SEO title="Voting" />
          <Header title="Voting" description={this.state.votingEnded ? 'Voting has ended. Please check the results page.' : this.state.voted ? 'You already voted! Results will be released when the election ends.' : this.state.votingOpen ? 'Please select the candidates that you want to vote for. \n You do not need to select a candidate for each position' : 'Voting is currently closed.'} />
          {this.state.dataLoading
            ? (
              <>
                <Skeleton borderRadius="4px" width="180px" height="30px" marginBottom="24px" />
                <Grid gridTemplateColumns={window.innerWidth > 960 ? 'repeat(auto-fill, 310px)' : '1fr'} gridColumnGap="24px" gridRowGap="24px">
                  <Skeleton borderRadius="12px" width="100%" height="60px" />
                  <Skeleton borderRadius="12px" width="100%" height="60px" />
                  <Skeleton borderRadius="12px" width="100%" height="60px" marginBottom="24px" />
                </Grid>
              </>
            )
            : this.state.positions.map((position) => (
              <>
                <CandidateRow position={position} numWinners={this.state.rawPositions[position].numWinners}>
                  {this.state.candidates[position].map((candidate) => (
                    <CandidateCard
                      id={candidate.id}
                      onChecked={this.createVote}
                      currentSelection={this.state.votes[position].selectedCandidates}
                      isDisabled={this.state.votes[position].selected}
                      voted={this.state.voted}
                      votingClosed={!this.state.votingOpen}
                      photoURL={candidate.photoURL}
                      first={candidate.first}
                      last={candidate.last}
                      position={position}
                      numWinners={this.state.votes[position].numWinners}
                      numSelected={this.state.votes[position].numSelected}
                    />
                  ))}
                </CandidateRow>
              </>
            ))}
          {this.state.dataLoading
            ? <Skeleton margin="auto" width="140px" height="48px" borderRadius="12px" />
            : (
              <ToastContext.Consumer>
                {(toast) => (
                  <>
                    <Box width="100%" display="flex" alignItems="center">
                      <Button
                        onClick={() => this.confirmVote(toast)}
                        margin="auto"
                        size="lg"
                        variantColor="teal"
                        borderRadius="12px"
                        px="64px"
                        py="16px"
                        marginBottom="24px"
                        isDisabled={!this.state.validated || this.state.voted}
                      >
                        Confirm
                      </Button>
                    </Box>
                    <Modal
                      isOpen={this.state.confirmationOpen}
                      onClose={() => this.setState({
                        confirmationOpen: false,
                        voteError: false,
                        voteSubmitting: false,
                        voteSuccessful: false,
                      })}
                    >
                      <ModalOverlay />
                      <ModalContent backgroundColor="blueGray.50" maxHeight="85vh" borderRadius="12px">
                        <ModalHeader fontWeight="bold" color="blueGray.900">
                          Confirm Your Vote
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody overflowY="scroll">
                          {this.createCandidateCards()}
                        </ModalBody>
                        <ModalFooter display="flex" flexDir="row" alignItems="center" justifyContent="center">
                          <Button
                            variantColor="primary"
                            borderRadius="12px"
                            px="56px"
                            onClick={() => this.submitVote(toast)}
                            isLoading={this.state.voteSubmitting}
                          >
                            Submit
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </>
                )}
              </ToastContext.Consumer>
            )}
        </Layout>
      </ToastProvider>
    );
  }
}
