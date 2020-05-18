import React from 'react';
import {
  Text, Box, Link, Button,
} from '@chakra-ui/core';
import firebase from 'gatsby-plugin-firebase';
import SEO from '../components/seo';
import { logout } from '../utils/auth';

const browser = typeof window !== 'undefined' && window;

const AuthError = () => (
  browser && (
    <Box px="40px" w="100vw" h="100vh" display="flex" flexDir="column" alignItems="center" justifyContent="center">
      <SEO title="Authentication Error" />
      <Box>
        <Text color="blueGray.900" fontWeight="bold" fontSize="24px">Something went wrong with authentication.</Text>
        <Text color="blueGray.600" fontWeight="600">
          For privacy reasons, you must be a JFSS Student to view Fraser Votes.
          <br />
          <br />
          If you are a teacher that would like to view Fraser Votes, please email us at
          {' '}
          <Link color="blue.700" textDecoration="underline" href="mailto:hello@fraservotes.com">hello@fraservotes.com</Link>
          <br />
          If you feel that this was a mistake, please email us at
          {' '}
          <Link color="blue.700" textDecoration="underline" href="mailto:hello@fraservotes.com">hello@fraservotes.com</Link>
          .
        </Text>
        <br />
        <Text color="blueGray.600" fontWeight="600" mb="8px">
          If you logged in with the wrong account, you can log out and log in with the correct one by clicking the button below.
        </Text>
        <Button
          _hover={{ bg: 'rgba(220, 238, 251, 0.5);' }}
          backgroundColor="blue.50"
          color="blue.800"
          px="18px"
          py="12px"
          borderRadius="8px"
          onClick={() => logout(firebase)}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  )
);

export default AuthError;
