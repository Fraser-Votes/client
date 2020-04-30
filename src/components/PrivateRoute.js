import React from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import { isLoggedIn, isAdmin } from "../utils/auth"

const PrivateRoute = ({ component: Component, admin, location, ...rest }) => {
  if (admin) {
    console.log(!isAdmin() && location.pathname !== `/app/login`)
    if (!isAdmin() && location.pathname !== `/app/login`) {
      navigate(`app/login`)
      return null
    }
  }
  else if (!isLoggedIn() && location.pathname !== `/app/login`) {
    // If we’re not logged in, redirect to the home page.
    navigate(`/app/login`)
    return null
  }

  return <Component {...rest} />
}

PrivateRoute.propTypes = {
  component: PropTypes.any.isRequired,
  admin: PropTypes.bool.isRequired
}

export default PrivateRoute
