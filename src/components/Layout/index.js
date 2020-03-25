import React from "react"
import PropTypes from "prop-types"
import { Desktop, IsDesktop } from "../../utils/mediaQueries"
import Sidebar from "../Sidebar"
import { Grid, Box } from "@chakra-ui/core"

const Layout = ({ children }) => {

  return (
    <Grid
      templateColumns= {IsDesktop() ? "290px 1fr" : "1fr" }
      templateRows="1fr"
    >
      <Desktop>
        <Sidebar/>
      </Desktop>
      <Box
        h="100%"
        w="100%"
        bg="blueGray.50"
        px="40px"
      >
        {children}
      </Box>
    </Grid>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
