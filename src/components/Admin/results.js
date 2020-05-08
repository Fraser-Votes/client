import React, { Component } from "react"
import Layout from "../Layout"
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

  sortByKey(array, key) {
    console.log(array, key)
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
    });
  }

  getResults = async () => {
      try {

        let resultsRef = await firebase.firestore().collection("election").doc("results").get()
        let results = resultsRef.data()

        let positionOrderRef = await firebase.firestore().collection("election").doc("positions").get()
        let positions = positionOrderRef.data().order

        let parsedResults = []
        for (var index in positions) {
            let position = positions[index]
            let tempResultsObj = []
            Object.keys(results[position]).forEach( async (candidateID) => {
                let candidateRef = await firebase.firestore().collection("candidates").doc(candidateID).get()
                let candidate = candidateRef.data()
                let name = candidate.first + " " + candidate.last
                let photoURL = candidate.photoURL
                tempResultsObj.push({name: name, count: results[position][candidateID], photoURL: photoURL})
            })
            // console.log(parsedResults)
            parsedResults.push({
                position: position,
                results: tempResultsObj
            })
            console.log(this.sortByKey(this.parsedResults[index].results, "count"))
        }

        console.log(parsedResults)
        this.setState({
            results: parsedResults,
            resultsLoading: false
        })
      } catch(err) {
          console.error("Error getting results: ", err)
      }
  }

}
