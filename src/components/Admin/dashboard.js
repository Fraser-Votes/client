import React, { Component } from "react"
import Layout from "../Layout"
import { Grid, Box, Text, Icon, Divider } from "@chakra-ui/core"
import LiveUsersChart from "./Charting/LiveUsersChart"
import SEO from "../seo"
import ReferrersChart from "./Charting/ReferrersChart"
import TopPagesChart from "./Charting/TopPagesChart"

const StatItem = ({ stat, bounce, first, title, mobile }) => {

  return (
    <Box 
      display="flex" flexDirection="column" width={mobile ? "40%" : first ? "18.5%" : "20%"}
    >
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

const Stats = ({ stats, mobile }) => {
  return (
    <Box
      borderRadius="12px"
      border="2px solid rgba(217, 226, 236, 0.55)"
      backgroundColor="white"
      width="100%"
      height={window.innerWidth > 1500 ? "100%" : mobile ? "300px" : "160px"}
      px="36px"
      py={mobile ? "24px" : "36px"}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
    >
      <StatItem
        mobile={mobile}
        first={true}
        stat={stats[1]}
        title="Page Views"
      />
      <Divider
        height={mobile ? "30%" : "85%"}
        borderLeftWidth="1.3px"
        borderColor="blueGray.100"
        orientation="vertical"
      />
      <StatItem mobile={mobile} stat={stats[4]} title="Votes Casted" />
      <Divider
        display={mobile ? "none" : ""}
        height="85%"
        borderLeftWidth="1.3px"
        borderColor="blueGray.100"
        orientation="vertical"
      />
      <StatItem
        mobile={mobile}
        bounce={true}
        stat={stats[2]}
        title="Bounce Rate"
      />
      <Divider
        height={mobile ? "30%" : "85%"}
        borderLeftWidth="1.3px"
        borderColor="blueGray.100"
        orientation="vertical"
      />
      <StatItem mobile={mobile} stat={stats[3]} title="New Users" />
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
      referrerNames: [],
      referrerCounts: [],
      topPagesCounts: [],
      topPagesNames: [],
      audience_present_index: 0,
      present_index: 0,
      audeincePlot: [],
      audienceLabels: [],
      audienceStats: [],
      loading1: true,
      loading2:  true,
      loading3: true,
      loading4: true,
      loading5: true,
      loading6: true
    }
  }

  componentDidMount() {
    this.innerWidth = window.innerWidth
    this.getQuickStats()
  }

  render() {
    return (
      <Layout>
        <SEO title="Dashboard" />
        {this.state.loading1 ||
        this.state.loading2 ||
        this.state.loading3 ||
        this.state.loading4 ||
        this.state.loading5 ||
        this.state.loading6 ? (
          "Loading"
        ) : (
          <Grid
            minHeight="100vh"
            my={this.innerWidth > 960 ? "40px" : "80px"}
            gridTemplateColumns={this.innerWidth > 1500 ? "2fr 1fr" : "1fr"}
            gridTemplateRows={
              this.innerWidth > 1500
                ? "1fr 1fr"
                : this.innerWidth > 700
                ? "160px 280px 360px 480px"
                : "300px minmax(280px, 2fr) repeat(3, 480px)"
            }
            gridColumnGap="40px"
            gridRowGap="40px"
          >
            {this.innerWidth > 1500 ? (
              <>
                <Box
                  gridArea="1 / 1 / 2 / 2"
                  display="grid"
                  gridTemplateColumns="1fr"
                  gridTemplateRows="1fr 2fr"
                  gridRowGap="40px"
                >
                  <Box gridArea="1 / 1 / 2 / 2">
                    <Stats stats={this.state.stats} />
                  </Box>
                  <Box gridArea="2 / 1 / 3 / 2">
                    <LiveUsersChart
                      presentIndex={this.state.present_index}
                      innerWidth={this.innerWidth}
                      data={this.state.plot}
                      labels={this.state.labels}
                    />
                  </Box>
                </Box>
                <Box
                  backgroundColor="white"
                  gridArea="2 / 1 / 3 / 2"
                  width="100%"
                  height="100%"
                >
                  asdf
                </Box>
                <ReferrersChart
                  referrerCounts={this.state.referrerCounts}
                  referrerNames={this.state.referrerNames}
                />
                <TopPagesChart
                  topPagesCounts={this.state.topPagesCounts}
                  topPagesNames={this.state.topPagesNames}
                />
                {/* <Box
                  backgroundColor="white"
                  gridArea="2 / 2 / 3 / 3"
                  width="100%"
                  height="100%"
                >
                  asdf
                </Box> */}
              </>
            ) : (
              <>
                {this.innerWidth < 700 ? (
                  <Stats mobile={true} stats={this.state.stats} />
                ) : (
                  <Stats stats={this.state.stats} />
                )}
                <LiveUsersChart
                  presentIndex={this.state.present_index}
                  innerWidth={this.innerWidth}
                  data={this.state.plot}
                  labels={this.state.labels}
                />
                <Box backgroundColor="white" width="100%" height="100%">
                  asdf
                </Box>
                {this.innerWidth > 700 ? (
                  <Box
                    display="grid"
                    gridTemplateColumns={this.innerWidth < 700 ? "" : "1fr 1fr"}
                    gridColumnGap="40px"
                  >
                    <ReferrersChart
                      referrerCounts={this.state.referrerCounts}
                      referrerNames={this.state.referrerNames}
                    />
                    <TopPagesChart
                      topPagesCounts={this.state.topPagesCounts}
                      topPagesNames={this.state.topPagesNames}
                    />
                  </Box>
                ) : (
                  <>
                    <ReferrersChart
                      referrerCounts={this.state.referrerCounts}
                      referrerNames={this.state.referrerNames}
                    />
                    <TopPagesChart
                      topPagesCounts={this.state.topPagesCounts}
                      topPagesNames={this.state.topPagesNames}
                    />
                  </>
                )}
              </>
            )}
          </Grid>
        )}
      </Layout>
    )
  }

  getQuickStats = () => {
    let date = new Date(Date.now()).toLocaleDateString('fr-CA')
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
        console.log(data)
        this.setState({
          labels: data.labels,
          plot: data.plot,
          present_index: data.present_index,
          stats: data.top_stats,
          loading2: false
        })
      })
     
    fetch(`https://plausible.io/api/stats/fraservotes.com/main-graph?period=day&date=${date}&from=undefined&to=undefined&filters=%7B%22goal%22%3A%22New%20User%22%7D`, {
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
        console.log(data)
        data.top_stats[1].name = "new users"
        this.setState(prevState => ({
            stats: [...prevState.stats, data.top_stats[1]],
            loading1: false
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
        console.log(data)
        data.top_stats[1].name = "votes"
        this.setState(prevState => ({
          stats: [...prevState.stats, data.top_stats[1]],
        }), () => {
          this.setState({
            loading3: false
          })
        })
      })
    fetch(`https://plausible.io/api/stats/fraservotes.com/referrers?period=day&date=${date}&from=undefined&to=undefined&filters=%7B%22goal%22%3Anull%7D&limit=7`, {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://plausible.io/fraservotes.com",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "omit"
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      let counts = []
      let referrers = []
      for (var referrer in data) {
        counts.push(data[referrer].count)
        referrers.push(data[referrer].name)
      }
      this.setState({
        referrerNames: referrers,
        referrerCounts: counts,
        loading4: false
      })
    })

    fetch(`https://plausible.io/api/stats/fraservotes.com/pages?period=day&date=${date}&from=undefined&to=undefined&filters=%7B%22goal%22%3Anull%7D&limit=7`, {
      "headers": {
        "accept": "*/*",
        "accept-language": "en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
      },
      "referrer": "https://plausible.io/fraservotes.com",
      "referrerPolicy": "no-referrer-when-downgrade",
      "body": null,
      "method": "GET",
      "mode": "cors",
      "credentials": "omit"
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      let counts = []
      let pages = []
      for (var page in data) {
        counts.push(data[page].count)
        pages.push(data[page].name)
      }
      this.setState({
        topPagesNames: pages,
        topPagesCounts: counts,
        loading5: false
      })
    })

    fetch(
      `https://plausible.io/api/stats/fraservotes.com/main-graph?period=7d&date=${date}&from=undefined&to=undefined&filters=%7B%22goal%22%3Anull%7D`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        referrer: "https://plausible.io/fraservotes.com?period=7d",
        referrerPolicy: "no-referrer-when-downgrade",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "omit",
      }
    )
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({
          audienceLabels: data.labels,
          audeincePlot: data.plot,
          audience_present_index: data.present_index,
          audienceStats: data.top_stats,
          loading6: false,
        })
      })
  }
}
