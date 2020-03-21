import React, { useState } from "react"
import { navigate } from "@reach/router"
import { setUser, isLoggedIn } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"
import { Button, Box, Grid, Text } from "@chakra-ui/core"
import loginIllustration from "../images/loginIllustration.svg"

const Login = () => {

  const [authLoading, setAuthLoading] = useState(false)

  var provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({
    'login_hint': '000000@pdsb.net'
  })

  if (isLoggedIn()) {
    navigate('/app/profile')
    return null
  }

  const googleAuth = () => {
    setAuthLoading(true)
    firebase.auth().signInWithPopup(provider).then(res => {
      setUser(res.user)
      navigate('/app/profile')
    }).catch(err => {
      setAuthLoading(false)
      console.warn("Something went wrong with authentication: " + err)
    })
  }

  return (
    <Grid gridTemplateColumns="8fr 6fr" gridTemplateRows="1fr"> 
      <Box 
        backgroundPosition="center center" 
        backgroundRepeat="no-repeat" 
        backgroundSize="65%" 
        backgroundImage={`url("${loginIllustration}")`} 
        backgroundColor="primary.500" 
        h="100vh"
      />
      <Box h="100vh" textAlign="center">
        <Text fontWeight="bold" fontSize="48px">JFSS Voting Platform</Text>
        <Text>Student Activity Council Elections 2020</Text>
        <Button isLoading={authLoading} size="lg" py="16px" px="92px" borderRadius="12px" onClick={googleAuth} variantColor="primary">
          Continue
        </Button>
        <Text letterSpacing="normal" color="blueGray.600" marginTop="12px" fontSize="sm">Please log in using your pdsb.net email</Text>
      </Box>
    </Grid>
  )
}

export default Login
