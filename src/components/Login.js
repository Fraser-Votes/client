import React from "react"
import { navigate } from "@reach/router"
import { setUser, isLoggedIn } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"
import { Button } from "@chakra-ui/core"

const Login = () => {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    'login_hint': '000000@pdsb.net'
  })

  if (isLoggedIn()) {
    navigate(`/app/profile`)
    return null
  }

  const googleAuth = () => {
    firebase.auth().signInWithPopup(provider).then(res => {
      setUser(res.user)
      navigate('/app/profile')
    }).catch(err => {
      console.warn("Something went wrong with authentication: " + err)
    })
  }

  return (
    <div>
      <div>

      </div>
      <div>
        <p>Please sign-in to access to the private route:</p>
        <Button onClick={googleAuth} width="100%" variantColor="primary" size="lg">
          Continue
        </Button>
      </div>
    </div>
  )
}

export default Login
