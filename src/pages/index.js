import React from 'react';
import { LightMode } from '@chakra-ui/core';
import Login from '../components/Login';
import "../index.css";

const IndexPage = () => (
  <LightMode>
    <Login />
  </LightMode>
);

export default IndexPage;
