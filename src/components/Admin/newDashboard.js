import React, { Component } from 'react';
import Layout from '../Layout';
import AdminSEO from '../adminSEO';
import { Helmet } from 'react-helmet';

const NewDashboard = () => (
  <Layout>
    <Helmet>
      <script async src="https://plausible.io/js/embed.host.js"></script>
    </Helmet>
    <AdminSEO title="Dashboard" />
    <iframe plausible-embed src="https://plausible.io/share/fraservotes.com?auth=cWmhHJ0J6FeneC6USBpZM&embed=true&theme=light&background=transparent" scrolling="no" frameborder="0" loading="lazy" style={{width: '1px', minWidth: '100%', height: '1600px' }}></iframe>
  </Layout>
);

export default NewDashboard;