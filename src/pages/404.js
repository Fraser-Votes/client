import React from 'react';

const browser = typeof window !== 'undefined' && window;
const NotFoundPage = () => (
  browser && (
  <div className="404-wrapper">
    <h1>NOT FOUND</h1>
    <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
  </div>
  )
);

export default NotFoundPage;
