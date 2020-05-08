import React, { Component } from "react"
import Layout from "../Layout"
import { sortByKey } from "../../utils/helpers"
import { IsMobile } from "../../utils/mediaQueries"
import { Box, Text, Grid } from "@chakra-ui/core"
import AdminSEO from "../adminSEO"
import firebase from "gatsby-plugin-firebase"

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
            {this.state.results.map((results) => {
              // return <ResultsChart results={results.results} position={results.position}/>
            })}
          </Grid>
        }
      </Layout>
    )
  }

  getResults = async () => {
    const db = firebase.firestore()
    try {
      const resultsRef = await db.collection("election").doc("results").get()
      const resultData = resultsRef.data()
      const positionRef = await db.collection("election").doc("positions").get()
      const positions = positionRef.data().order

      const results = await Promise.all(positions.map(async (position) => {
          const positionResults = await Promise.all(
            Object.keys(resultData[position]).map(async (id) => {
              const ref = await db.collection("candidates").doc(id).get()
              const candidate = ref.data()
              const name = candidate.first + " " + candidate.last
              const photoURL = candidate.photoURL
              return { name, photoURL, count: resultData[position][id] }
            })
          )
          return { position, results: sortByKey(positionResults, "count") }
        })
      )
      this.setState({ results, resultsLoading: false })
    } catch (err) {
      console.error("Error getting results: ", err)
    }
  }

}
