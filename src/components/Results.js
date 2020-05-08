import React from 'react';
import { Box, Text, Image } from '@chakra-ui/core';
import Layout from './Layout';
import Header from './Header';
import SEO from './seo';
import EmptyStateImage from '../images/empty-state.svg';

const Results = () => (
  <Layout>
    <Box h="10vh">
      <Header
        title="Results"
        description="Here are your elected Student Activity Council Executives"
      />
    </Box>
    <SEO title="Results" />
    <Box
      h="90vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      paddingBottom="4vh"
    >
      <Image h="50%" src={EmptyStateImage} />
      <Text marginTop="12px" fontWeight="bold" fontSize="20px" color="blueGray.500">
        Nothing to see here...
      </Text>
      <Text marginTop="8px" textAlign="center" fontWeight="regular" fontSize="16px" color="blueGray.500">
        The election hasn’t ended yet.
        <br />
        Come back soon to see the results of the election.
      </Text>
    </Box>
  </Layout>
);

export default Results;
