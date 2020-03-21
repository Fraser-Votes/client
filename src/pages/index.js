import React from "react"
import { Link } from "gatsby"

import Layout from "../components/Layout"
import Image from "../components/image"
import SEO from "../components/seo"
import Login from "../components/Login"
import { ThemeProvider } from "@chakra-ui/core"
import theme from "../gatsby-plugin-chakra-ui/theme"

/**
 * TODO: just make the index page the login page
 */
const IndexPage = () => (
    <Login/>
)

export default IndexPage
