import React from "react"
import { Router } from "@reach/router"
// import Layout from "../components/Layout"
import PrivateRoute from "../components/PrivateRoute"
import Login from "../components/Login"
import { logout } from "../utils/auth"
import firebase from "gatsby-plugin-firebase"

const TestComponent = () => <button onClick={() => logout(firebase)}>This is a test!</button>

const App = () => (
  <div>
    <Router basepath="/app">
      <PrivateRoute path="/profile" component={TestComponent} />
      <Login path="/login" />
    </Router>
  </div>
)

export default App
