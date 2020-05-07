import React, { Component } from "react"
import Layout from "../Layout"
import { IsMobile } from "../../utils/mediaQueries"
import { Box, Text, Grid } from "@chakra-ui/core"
import AdminSEO from "../adminSEO"
import firebase from "gatsby-plugin-firebase"
import ResultsChart from "./Charting/ResultsChart"

const Header = ({ title }) => {
  return (
    <Box
      mt={IsMobile() ? "46px" : "12px"}
      h="76px"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <Text fontSize="2xl" fontWeight="bold" color="blueGray.900">
        {title}
      </Text>
    </Box>
  )
}

export default class Results extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: null,
      resultsLoading: true,
    }
  }

  componentDidMount() {
      this.getResults()
  }

  render() {
    return (
      <Layout>
        <AdminSEO title="Results" />
        <Header title="Results" />
        {this.state.resultsLoading ? 
        "Loading" 
        : 
        <Grid>
            <ResultsChart />
        </Grid>
        }
      </Layout>
    )
  }

  getResults = async () => {
      try {
        let resultsRef = await firebase.firestore().collection("election").doc("results").get()
        this.setState({
            results: resultsRef.data(),
            resultsLoading: false
        })
      } catch(err) {
          console.error("Error getting results: ", err)
      }
      
  }

}
