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
  title, publishResults, loading, toast,
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
      onClick={() => publishResults(toast)}
      isLoading={loading}
    >
      Publish Results
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

      const results = await Promise.all(positions.map(async (position) => {
        const positionResults = await Promise.all(
          Object.keys(resultData[position]).map(async (id) => {
            const ref = await db.collection('candidates').doc(id).get();
            const candidate = ref.data();
            const name = `${candidate.first} ${candidate.last}`;
            const { photoURL } = candidate;
            return {
              name, photoURL, count: resultData[position][id], id,
            };
          }),
        );
        return { position, results: sortByKey(positionResults, 'count') };
      }));
      this.setState({ results, resultsLoading: false });
    } catch (err) {
      console.error('Error getting results: ', err);
    }
  }

  publishResults = async (toast) => {
    try {
      const publicResults = {};
      this.setState({ publishing: true });

      this.state.results.map((result) => {
        publicResults[result.position] = result.results[0].id;
      });

      await firebase.firestore().collection('election').doc('public_results').set(publicResults);

      this.setState({ publishing: false });
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

  render() {
    return (
      <Layout>
        <ToastProvider>
          <ToastContext.Consumer>
            {(toast) => (
              <>
                <>
                  <AdminSEO title="Results" />
                  <Header toast={toast} loading={this.state.publishing} title="Results" publishResults={this.publishResults} />
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
