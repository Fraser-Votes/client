import React from "react"
import { Router } from "@reach/router"
import { LightMode, Box } from "@chakra-ui/core"
import Candidates from "../components/Candidates"
import Voting from "../components/Voting"
import PrivateRoute from "../components/PrivateRoute"

const Admin = () => (
  <LightMode>
  <Box>
    <Router basepath="/admin">
        <PrivateRoute default admin={true} path="candidates" component={Candidates} />
        <PrivateRoute path="voting" admin={true} component={Voting} />
    </Router>
  </Box>
  </LightMode>
)

export default Admin
