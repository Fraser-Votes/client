import React from 'react';
import { Router } from '@reach/router';
import { LightMode, Box } from '@chakra-ui/core';
import PrivateRoute from '../components/PrivateRoute';
import Login from '../components/Login';
import Candidates from '../components/Candidates';
import Voting from '../components/Voting';
import Profile from '../components/Profile/Profile';
import Results from '../components/Results';

const App = () => (
  <LightMode>
    <Box>
      <Router basepath="/app">
        <PrivateRoute path="candidates" default component={Candidates} />
        <PrivateRoute path="voting" component={Voting} />
        <PrivateRoute path="results" component={Results} />
        <PrivateRoute path="candidates/:candidateID" component={Profile} />
        <Login path="login" />
      </Router>
    </Box>
  </LightMode>
);

export default App;
