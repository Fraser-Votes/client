import React, { Component } from 'react';
import {
  Box, Text, Image, Divider, Grid,
} from '@chakra-ui/core';
import firebase from 'gatsby-plugin-firebase';
import { navigate } from 'gatsby';
import Layout from './Layout';
import Header from './Header';
import SEO from './seo';
import EmptyStateImage from '../images/empty-state.svg';
import { IsDesktop } from '../utils/mediaQueries';
import PlaceholderImage from '../images/placeholder.jpg';

const CandidateCard = ({
  name, grade, photoURL, id, position,
}) => (
  <Box
    background="white"
    overflow="hidden"
    borderRadius="16px"
    width="100%"
    minHeight="250px"
    mb={IsDesktop() ? 0 : '32px'}
    display="flex"
    flexDirection="column"
    boxShadow="0px -0.193708px 3.7358px rgba(0, 0, 0, 0.0112458), 0px -0.465507px 8.97764px rgba(0, 0, 0, 0.0161557), 0px -0.876509px 16.9041px rgba(0, 0, 0, 0.02), 0px -1.56354px 30.154px rgba(0, 0, 0, 0.0238443), 0px -2.92443px 56.3998px rgba(0, 0, 0, 0.0287542), 0px -7px 135px rgba(0, 0, 0, 0.04);"
  >
    <Image fallbackSrc={PlaceholderImage} objectFit="cover" h={IsDesktop() ? '180px' : '30vh'} w="100%" src={photoURL} />
    <Box
      as="button"
      onClick={() => { navigate(`/app/candidates/${id}`); }}
      alignItems="center"
      mx="14px"
      justifyContent="space-between"
      h="35px"
      flexDirection="row"
      display="flex"
    >
      <Text fontWeight="bold" fontSize="14px" color="blueGray.800">
        {name}
      </Text>
      <Text fontWeight="bold" fontSize="12px" color="blueGray.500">
        Grade
        {' '}
        {grade}
      </Text>
    </Box>
    <Divider my="0px" color="#F0F4F8" borderWidth="1.5px" />
    <Box
      px="14px"
      display="flex"
      flexDirection="row"
      alignItems="center"
      h="35px"
    >
      <Text fontWeight="bold" fontSize="12px" color="blue.800" textTransform="capitalize">
        {position.replace('-', ' ')}
      </Text>
    </Box>
  </Box>
);


const Empty = () => (
  <>
    <Box
      h="80vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      paddingBottom="4vh"
    >
      <Image h="45%" src={EmptyStateImage} />
      <Text marginTop="16px" fontWeight="bold" fontSize="20px" color="blueGray.500">
        Nothing to see here...
      </Text>
      <Text marginTop="8px" textAlign="center" fontWeight="regular" fontSize="16px" color="blueGray.500">
        The election hasn’t ended yet.
        <br />
        Come back soon to see the results of the election.
      </Text>
    </Box>
  </>
);

export default class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resultsPublished: null,
      results: null,
      loading: true,
    };
  }

  componentDidMount() {
    this.hydrateWithFirebase();
  }

  hydrateWithFirebase = async () => {
    const db = firebase.firestore();
    const votingStatusRef = await db.collection('election').doc('voting').get();
    const { resultsPublished } = votingStatusRef.data();
    if (resultsPublished) {
      const positionsRef = await db.collection('election').doc('positions').get();
      const positions = positionsRef.data().order;

      const resultsRef = await db.collection('election').doc('public_results').get();
      const results = resultsRef.data();

      const orderedResults = [];
      positions.forEach((position) => {
        orderedResults.push({ ...results[position], position });
      });

      this.setState({
        results: orderedResults,
      });
    }

    this.setState({
      resultsPublished,
      loading: false,
    });
  }

  render() {
    return (
      <Layout>
        <Header
          title="Results"
          description="Here are your elected Student Activity Council Executives"
        />
        <SEO title="Results" />
        {/* eslint-disable-next-line no-nested-ternary */}
        {this.state.loading
          ? 'Loading'
          : this.state.resultsPublished
            ? (
              <Grid mb="40px" templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gridColumnGap="40px" gridRowGap="40px">
                {this.state.results.map((result) => (
                  <CandidateCard
                    position={result.position}
                    name={result.name}
                    photoURL={result.photoURL}
                    grade={result.grade}
                    id={result.id}
                  />
                ))}
              </Grid>
            )
            : <Empty />}
      </Layout>
    );
  }
}
