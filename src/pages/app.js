import React from "react"
import { Router } from "@reach/router"
// import Layout from "../components/Layout"
import PrivateRoute from "../components/PrivateRoute"
import Login from "../components/Login"

const TestComponent = () => <div>This is a test!</div>

const App = () => (
  <div>
    <Router>
      <PrivateRoute path="/app/profile" component={TestComponent} />
      <Login path="/app/login" />
    </Router>
  </div>
)

export default App
