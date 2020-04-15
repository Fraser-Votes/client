import React from "react"
import PropTypes from "prop-types"
import { Desktop, IsDesktop, Mobile } from "../../utils/mediaQueries"
import Sidebar from "../Sidebar"
import { Grid, Box, Icon } from "@chakra-ui/core"
import MobileHeader from "../MobileHeader"

const Layout = ({ children }) => {

  return (
    <Grid
      templateColumns= {IsDesktop() ? "290px 1fr" : "1fr" }
      templateRows="1fr"
    >
      <Desktop>
        <Sidebar/>
      </Desktop>
      <Mobile>
        <MobileHeader/>
      </Mobile>
      <Box
        minHeight="100vh"
        h="100%"
        w="100%"
        bg="blueGray.50"
        px="40px"
        maxHeight="100vh"
        overflowY="auto"
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
