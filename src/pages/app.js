import React from "react"
import { Router } from "@reach/router"
import PrivateRoute from "../components/PrivateRoute"
import Login from "../components/Login"
import { LightMode, Box } from "@chakra-ui/core"
import Candidates from "../components/Candidates"
import Voting from "../components/Voting"
import NotFoundPage from "./404"

const App = () => (
  <LightMode>
  <Box>
    <Router basepath="/app">
        <NotFoundPage default/>
        <PrivateRoute path="/candidates" component={Candidates} />
        <PrivateRoute path="/voting" component={Voting} />
        <PrivateRoute path="/results" component={Candidates} />
      <Login path="/login" />
    </Router>
  </Box>
  </LightMode>
)

export default App
