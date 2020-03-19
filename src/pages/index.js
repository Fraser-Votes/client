import React from "react"
import { Link } from "gatsby"

import Layout from "../components/Layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Login from "../components/Login"

/**
 * TODO: just make the index page the login page
 */
const IndexPage = () => (
  <Layout>
    <Login/>
  </Layout>
)

export default IndexPage
