import React, { Component } from 'react';
import { Box, Text, Button } from '@chakra-ui/core';
import Layout from '../Layout';
import { IsMobile } from '../../utils/mediaQueries';

const Header = ({ title, addPosition }) => (
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
      onClick={addPosition}
    >
      Add Position
    </Button>
  </Box>
);

export default class Positions extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <Layout>
        <Header title="Positions" addPosition={this.addPosition} />
      </Layout>
    );
  }
}
