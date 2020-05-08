import React from 'react';
import PropTypes from 'prop-types';
import { navigate } from 'gatsby';
import { isLoggedIn, isAdmin, isBrowser } from '../utils/auth';

const PrivateRoute = ({
  component: Component, admin, location, ...rest
}) => {
  if (admin) {
    if (!isAdmin() && isBrowser() && location.pathname !== '/app/login') {
      navigate('app/login');
      return null;
    }
  } else if (!isLoggedIn() && isBrowser() && location.pathname !== '/app/login') {
    // If we’re not logged in, redirect to the home page.
    navigate('/app/login');
    return null;
  }

  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...rest} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  admin: PropTypes.bool.isRequired,
};

export default PrivateRoute;
