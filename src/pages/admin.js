import React from "react"
import { Router } from "@reach/router"
import Login from "../components/Login"
import { LightMode, Box } from "@chakra-ui/core"
import Candidates from "../components/Candidates"
import Voting from "../components/Voting"
import Profile from  '../components/Profile/Profile'
import Results from "../components/Results"
import PrivateAdminRoute from "../components/PrivateAdminRoute"

const App = () => (
  <LightMode>
  <Box>
    <Router basepath="/admin">
        <PrivateAdminRoute path="candidates" component={Candidates} />
    </Router>
  </Box>
  </LightMode>
)

export default App
