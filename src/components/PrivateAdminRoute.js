import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { isLoggedIn } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"


const PrivateAdminRoute = ({ component: Component, location, ...rest }) => {
    
  if (!isLoggedIn() && location.pathname !== `/app/login` && !isAdmin()) {
    // If we’re not logged in, redirect to the home page.
    navigate(`/app/login`)
    return null
  }

  return <Component {...rest} />
}

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
}

export default PrivateRoute
