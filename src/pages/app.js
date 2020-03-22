import React from "react"
import { Router } from "@reach/router"
import PrivateRoute from "../components/PrivateRoute"
import Login from "../components/Login"
import { logout } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"
import { LightMode } from "@chakra-ui/core"

const TestComponent = () => <button onClick={() => logout(firebase)}>This is a test!</button>

const App = () => (
  <LightMode>
  <div>
    <Router basepath="/app">
      <PrivateRoute path="/candidates" component={TestComponent} />
      <Login path="/login" />
    </Router>
  </div>
  </LightMode>
)

export default App
