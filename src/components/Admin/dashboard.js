import React, { Component } from "react"
import Layout from "../Layout"
import { Grid, Box, Text, Icon, Divider } from "@chakra-ui/core"

const StatItem = ({ stat, bounce, last, title }) => {
  return (
    <Box display="flex" flexDirection="column" width="20%">
      <Text color="blueGray.500" fontSize="16px" fontWeight="600">
        {title}
      </Text>
      <Text color="blueGray.900" fontSize="24px" fontWeight="600">
        {bounce ? stat.percentage + "%" : stat.count}
      </Text>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
      >
        <Icon mt="2px" mr="8px" size="22px" name={stat.change >= 0 ? "increasing_arrow" : "decreasing_arrow"}/>
        <Text
          fontSize="16px"
          fontWeight="600"
          color={stat.change >= 0 ? "teal.600" : "red.400"}
        >
          {stat.change}%
        </Text>
      </Box>
    </Box>
  )
}

const Stats = ({ stats }) => {
  return (
    <Box
      borderRadius="12px"
      border="2px solid rgba(217, 226, 236, 0.55)"
      backgroundColor="white"
      gridArea={window.innerWidth > 1500 ? "1 / 1 / 2 / 2" : ""}
      width="100%"
      height={window.innerWidth > 1500 ? "100%" : "160px"}
      px="36px"
      py="36px"
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
    >
      <StatItem stat={stats[1]} title="Page Views" />
      <Divider height="85%" borderLeftWidth="1.3px" borderColor="blueGray.100" orientation="vertical"/>
      <StatItem stat={stats[4]} title="Votes Casted"/>
      <Divider height="85%" borderLeftWidth="1.3px" borderColor="blueGray.100" orientation="vertical"/>
      <StatItem bounce={true} stat={stats[2]} title="Bounce Rate"/>
      <Divider height="85%" borderLeftWidth="1.3px" borderColor="blueGray.100" orientation="vertical"/>
      <StatItem last={true} stat={stats[3]} title="New Users"/>
    </Box>
  )
}

export default class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      labels: [],
      plot: [],
      stats: [],
      dataLoading: true,
    }
  }

  componentDidMount() {
    this.innerWidth = window.innerWidth
    this.getQuickStats()
  }

  render() {
    return (
      <Layout>
        {this.state.dataLoading ? (
          "Loading"
        ) : (
          <Grid
            height="100vh"
            my="40px"
            gridTemplateColumns={this.innerWidth > 1500 ? "2fr 1fr" : "1fr"}
            gridTemplateRows={this.innerWidth > 1500 ? "repeat(2, 1fr)" : ""}
            gridColumnGap="40px"
            gridRowGap="40px"
          >
            <Stats stats={this.state.stats} />
            <Box
              backgroundColor="white"
              gridArea={this.innerWidth > 1500 ? "1 / 2 / 2 / 3" : ""}
              width="100%"
              height="100%"
            >
              asdf
            </Box>
            <Box
              backgroundColor="white"
              gridArea={this.innerWidth > 1500 ? "2 / 1 / 3 / 2" : ""}
              width="100%"
              height="100%"
            >
              asdf
            </Box>
            <Box
              backgroundColor="white"
              gridArea={this.innerWidth > 1500 ? "2 / 2 / 3 / 3" : ""}
              width="100%"
              height="100%"
            >
              asdf
            </Box>
          </Grid>
        )}
      </Layout>
    )
  }

  getQuickStats = () => {
    let date = new Date(Date.now()).toLocaleDateString().split("/")
    if (date[0] < 10) {
      date[0] = "0" + date[0]
    }
    date = date[2] + "-" + date[0] + "-" + date[1]
    console.log(date)
    fetch(
      `https://plausible.io/api/stats/fraservotes.com/main-graph?period=day&date=${date}&from=undefined&to=undefined&filters=%7B%22goal%22%3Anull%7D`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        referrer: "https://plausible.io/fraservotes.com?period=day",
        referrerPolicy: "no-referrer-when-downgrade",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      }
    )
      .then(res => res.json())
      .then(data => {
        this.setState({
          labels: data.labels,
          plot: data.plot,
          present_index: data.present_index,
          stats: data.top_stats,
        })
      })
     
    fetch("https://plausible.io/api/stats/fraservotes.com/main-graph?period=day&date=2020-04-30&from=undefined&to=undefined&filters=%7B%22goal%22%3A%22New%20User%22%7D", {
    "headers": {
        "accept": "*/*",
        "accept-language": "en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
    },
    "referrer": "https://plausible.io/fraservotes.com?period=day&goal=New+User",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "omit"
    })
    .then(res => res.json())  
    .then(data => {
        data.top_stats[1].name = "new users"
        this.setState(prevState => ({
            stats: [...prevState.stats, data.top_stats[1]]
        }))
    })

    fetch(
      `https://plausible.io/api/stats/fraservotes.com/main-graph?period=day&date=${date}&from=undefined&to=undefined&filters=%7B%22goal%22%3A%22Vote%22%7D`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        referrer: "https://plausible.io/fraservotes.com?period=day&goal=Vote",
        referrerPolicy: "no-referrer-when-downgrade",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      }
    )
      .then(res => res.json())
      .then(data => {
        data.top_stats[1].name = "votes"
        this.setState(prevState => ({
          stats: [...prevState.stats, data.top_stats[1]],
          dataLoading: false,
        }))
      })
  }
}
