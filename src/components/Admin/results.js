import React, { Component } from 'react';
import {
  Box, Text, Grid, Button, useToast, Skeleton,
} from '@chakra-ui/core';
import firebase from 'gatsby-plugin-firebase';
import Layout from '../Layout';
import ResultsChart from './Charting/ResultsChart';
import { sortByKey } from '../../utils/helpers';
import { IsMobile } from '../../utils/mediaQueries';
import AdminSEO from '../adminSEO';

const ToastContext = React.createContext(() => { });
function ToastProvider({ children }) {
  const toast = useToast();
  return <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>;
}

const Header = ({
  title, publishResults, loading, toast, resultsPublished, unpublishResults,
}) => (
  <Box
    mt={IsMobile() ? '46px' : '12px'}
    h="76px"
    display="flex"
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
    mb="4px"
  >
    <Text fontSize="2xl" fontWeight="bold" color="blueGray.900">
      {title}
    </Text>
    <Button
      borderRadius="8px"
      px="18px"
      py="12px"
      fontSize="14px"
      fontWeight="600"
      variantColor="blue"
      onClick={() => (resultsPublished ? unpublishResults(toast) : publishResults(toast))}
      isLoading={loading}
    >
      { resultsPublished ? 'Unpublish Results' : 'Publish Results' }
    </Button>
  </Box>
);

export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      resultsLoading: true,
      publishing: false,
      resultStatus: false,
    };
  }

  componentDidMount() {
    this.getResults();
  }

  getResults = async () => {
    const db = firebase.firestore();
    try {
      const resultsRef = await db.collection('election').doc('results').get();
      const resultData = resultsRef.data();
      const positionRef = await db.collection('election').doc('positions').get();
      const positions = positionRef.data().order;
      const resultStatusRef = await db.collection('election').doc('voting').get();
      const resultStatus = resultStatusRef.data().resultsPublished;

      const results = await Promise.all(positions.map(async (position) => {
        const positionResults = await Promise.all(
          Object.keys(resultData[position]).map(async (id) => {
            const ref = await db.collection('candidates').doc(id).get();
            const candidate = ref.data();
            const name = `${candidate.first} ${candidate.last}`;
            const { grade } = candidate;
            const { photoURL } = candidate;
            return {
              name, photoURL, count: resultData[position][id], id, grade,
            };
          }),
        );
        return { position, results: sortByKey(positionResults, 'count') };
      }));
      this.setState({ results, resultsLoading: false, resultStatus });
    } catch (err) {
      console.error('Error getting results: ', err);
    }
  }

  publishResults = async (toast) => {
    try {
      const publicResults = {};
      this.setState({ publishing: true });

      this.state.results.map((result) => {
        const tempResult = result.results[0];
        publicResults[result.position] = {
          id: tempResult.id,
          name: tempResult.name,
          photoURL: tempResult.photoURL ? tempResult.photoURL : null,
          grade: tempResult.grade,
        };
      });

      await firebase.firestore().collection('election').doc('public_results').set(publicResults);
      await firebase.firestore().collection('election').doc('voting').update({
        resultsPublished: true,
      });

      this.setState({ publishing: false, resultStatus: true });
      toast({
        title: 'Results Published',
        description: 'Results have been published to the results page.',
        status: 'success',
        duration: 10000,
        isClosable: true,
      });
    } catch (err) {
      console.log('Error publishing results: ', err);
      this.setState({
        publishing: false,
      });
      toast({
        title: 'Error publishing results',
        description: err,
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    }
  }

  unpublishResults = async (toast) => {
    try {
      this.setState({
        publishing: true,
      });
      await firebase.firestore().collection('election').doc('voting').update({
        resultsPublished: false,
      });
      this.setState({
        publishing: false,
        resultStatus: false,
      });
      toast({
        title: 'Results unpublished',
        description: 'Results are no longer publicly visible',
        status: 'success',
        duration: 10000,
        isClosable: true,
      });
    } catch (err) {
      this.setState({
        publishing: false,
      });
      toast({
        title: 'Error unpublishing results',
        description: 'Please try again',
        status: 'error',
        duration: 10000,
        isClosable: true,
      });
    }
  }

  render() {
    return (
      <Layout>
        <ToastProvider>
          <ToastContext.Consumer>
            {(toast) => (
              <>
                <>
                  <AdminSEO title="Results" />
                  <Header toast={toast} loading={this.state.publishing || this.state.resultsLoading} unpublishResults={this.unpublishResults} resultsPublished={this.state.resultStatus} title="Results" publishResults={this.publishResults} />
                </>
                <>
                  {this.state.resultsLoading
                    ? (
                      <Grid mb="40px" templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gridColumnGap="40px" gridRowGap="40px">
                        <Skeleton height="35vh" borderRadius="12px" />
                        <Skeleton height="35vh" borderRadius="12px" />
                        <Skeleton height="35vh" borderRadius="12px" />
                        <Skeleton height="35vh" borderRadius="12px" />
                      </Grid>
                    )
                    : (
                      <Grid mb="40px" templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gridColumnGap="40px" gridRowGap="40px">
                        {this.state.results.map((results) => (
                          <ResultsChart results={results.results} position={results.position} />
                        ))}
                      </Grid>
                    )}
                </>
              </>
            )}
          </ToastContext.Consumer>
        </ToastProvider>
      </Layout>
    );
  }
}
