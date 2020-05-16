import React from 'react';
import { Router } from '@reach/router';
import { LightMode, Box } from '@chakra-ui/core';
import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../components/Admin/dashboard';
import Candidates from '../components/Admin/candidates';
import Settings from '../components/Admin/settings';
import Results from '../components/Admin/results';
import Positions from '../components/Admin/positions';

const Admin = () => (
  <LightMode>
    <Box>
      <Router basepath="/admin">
        <PrivateRoute default admin path="dashboard" component={Dashboard} />
        <PrivateRoute admin path="candidates" component={Candidates} />
        <PrivateRoute admin path="settings" component={Settings} />
        <PrivateRoute admin path="results" component={Results} />
        <PrivateRoute admin path="positions" component={Positions} />
      </Router>
    </Box>
  </LightMode>
);

export default Admin;
