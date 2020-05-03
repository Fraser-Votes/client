import React from "react"
import { Router } from "@reach/router"
import { LightMode, Box } from "@chakra-ui/core"
import PrivateRoute from "../components/PrivateRoute"
import Dashboard from "../components/Admin/dashboard"
import Candidates from "../components/Admin/candidates"

const Admin = () => (
  <LightMode>
  <Box>
    <Router basepath="/admin">
        <PrivateRoute default admin={true} path="dashboard" component={Dashboard} />
        <PrivateRoute admin={true} path="candidates" component={Candidates} />
    </Router>
  </Box>
  </LightMode>
)

export default Admin
