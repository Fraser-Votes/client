import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Box } from '@chakra-ui/core';
import { Desktop, Mobile } from '../../utils/mediaQueries';
import Sidebar from '../Sidebar';
import MobileHeader from '../MobileHeader';

const Layout = ({ children }) => (
  <>
    <Desktop>
      <Grid
        templateColumns="290px 1fr"
        templateRows="1fr"
      >
        <Sidebar />
        <Box
          minHeight="100vh"
          h="100%"
          w="100%"
          bg="blueGray.50"
          px="40px"
          maxHeight="100vh"
          overflowY="auto"
        >
          {children}
        </Box>
      </Grid>
    </Desktop>
    <Mobile>
      <Grid
        templateColumns="1fr"
        templateRows="1fr"
      >
        <MobileHeader />
        <Box
          minHeight="100vh"
          h="100%"
          w="100%"
          bg="blueGray.50"
          px="32px"
          maxHeight="100vh"
          overflowY="auto"
        >
          {children}
        </Box>
      </Grid>
    </Mobile>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
