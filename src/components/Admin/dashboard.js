import React, { Component } from 'react';
import {
  Grid, Box, Text, Icon, Divider, Skeleton,
} from '@chakra-ui/core';
import Layout from '../Layout';
import LiveUsersChart from './Charting/LiveUsersChart';
import AudienceChart from './Charting/AudienceChart';
import AdminSEO from '../adminSEO';
import ReferrersChart from './Charting/ReferrersChart';
import TopPagesChart from './Charting/TopPagesChart';

const StatItem = ({
  stat, bounce, first, title, mobile,
}) => (
  <Box
    display="flex"
    flexDirection="column"
    width={mobile ? '40%' : first ? '18.5%' : '20%'}
  >
    <Text color="blueGray.500" fontSize="16px" fontWeight="600">
      {title}
    </Text>
    <Text color="blueGray.900" fontSize="24px" fontWeight="600">
      {bounce ? `${stat.percentage}%` : stat.count}
    </Text>
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
    >
      <Icon mt="2px" mr="8px" size="22px" name={stat.change >= 0 ? 'increasing_arrow' : 'decreasing_arrow'} />
      <Text
        fontSize="16px"
        fontWeight="600"
        color={stat.change >= 0 ? 'teal.600' : 'red.400'}
      >
        {`${stat.change}%`}
      </Text>
    </Box>
  </Box>
);

const Stats = ({ topStats, newUserStats, votingStats, mobile }) => (
  <Box
    borderRadius="12px"
    border="2px solid rgba(217, 226, 236, 0.55)"
    backgroundColor="white"
    width="100%"
    height={window.innerWidth > 1500 ? '100%' : mobile ? '300px' : '160px'}
    px="36px"
    py={mobile ? '24px' : '36px'}
    display="flex"
    flexDirection="row"
    justifyContent="space-between"
    alignItems="center"
    flexWrap="wrap"
  >
    <StatItem
      mobile={mobile}
      first
      stat={topStats[1]}
      title="Page Views"
    />
    <Divider
      height={mobile ? '30%' : '85%'}
      borderLeftWidth="1.3px"
      borderColor="blueGray.100"
      orientation="vertical"
    />
    <StatItem mobile={mobile} stat={votingStats} title="Votes Cast" />
    <Divider
      display={mobile ? 'none' : ''}
      height="85%"
      borderLeftWidth="1.3px"
      borderColor="blueGray.100"
      orientation="vertical"
    />
    <StatItem
      mobile={mobile}
      bounce
      stat={topStats[2]}
      title="Bounce Rate"
    />
    <Divider
      height={mobile ? '30%' : '85%'}
      borderLeftWidth="1.3px"
      borderColor="blueGray.100"
      orientation="vertical"
    />
    <StatItem mobile={mobile} stat={newUserStats} title="New Users" />
  </Box>
);

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      plot: [],
      topStats: [],
      newUserStats: {},
      votingStats: {},
      referrerNames: [],
      referrerCounts: [],
      topPagesCounts: [],
      topPagesNames: [],
      audience_present_index: 0,
      present_index: 0,
      audiencePlot: [],
      audienceLabels: [],
      audienceStats: [],
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true,
      loading5: true,
      loading6: true,
    };
  }

  componentDidMount() {
    this.innerWidth = window.innerWidth;
    window.addEventListener('resize', () => { this.innerWidth = window.innerWidth; });
  }

  render() {
    return (
      <Layout>
        <AdminSEO title="Dashboard" />
      <iframe plausible-embed src="https://plausible.io/share/fraservotes.com?auth=cWmhHJ0J6FeneC6USBpZM&embed=true&theme=light&background=transparent" scrolling="no" frameborder="0" loading="lazy" style="width: 1px; min-width: 100%; height: 1600px;"></iframe>
<script async src="https://plausible.io/js/embed.host.js"></script>
      {/*
        {this.state.loading1
          || this.state.loading2
          || this.state.loading3
          || this.state.loading4
          || this.state.loading5
          || this.state.loading6 ? (
            <Grid
              minHeight="100vh"
              my={this.innerWidth > 960 ? '40px' : '80px'}
              gridTemplateColumns={this.innerWidth > 1500 ? '2fr 1fr' : '1fr'}
              gridTemplateRows={
                this.innerWidth > 1500
                  ? '1fr 1fr'
                  : this.innerWidth > 700
                    ? '160px 280px 440px 480px'
                    : '300px minmax(280px, 2fr) 410px repeat(2, 480px)'
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
                    <Skeleton borderRadius="12px" gridArea="1 / 1 / 2 / 2" />
                    <Skeleton borderRadius="12px" gridArea="2 / 1 / 3 / 2" />
                  </Box>
                  <Skeleton borderRadius="12px" />
                  <Skeleton borderRadius="12px" />
                  <Skeleton borderRadius="12px" />
                </>
              ) : (
                <>
                  {this.innerWidth < 700 ? (
                    <Skeleton borderRadius="12px" />
                  ) : (
                    <Skeleton borderRadius="12px" />
                  )}
                  <Skeleton borderRadius="12px" />
                  <Skeleton borderRadius="12px" />
                  {this.innerWidth > 700 ? (
                    <Box
                      display="grid"
                      gridTemplateColumns={this.innerWidth < 700 ? '' : '1fr 1fr'}
                      gridColumnGap="40px"
                    >
                      <Skeleton borderRadius="12px" />
                      <Skeleton borderRadius="12px" />
                    </Box>
                  ) : (
                    <>
                      <Skeleton borderRadius="12px" />
                      <Skeleton borderRadius="12px" />
                    </>
                  )}
                </>
              )}
            </Grid>
          ) : (
            <Grid
              minHeight="100vh"
              my={this.innerWidth > 960 ? '40px' : '80px'}
              gridTemplateColumns={this.innerWidth > 1500 ? '2fr 1fr' : '1fr'}
              gridTemplateRows={
                this.innerWidth > 1500
                  ? '1fr 1fr'
                  : this.innerWidth > 700
                    ? '160px 280px 440px 480px'
                    : '300px minmax(280px, 2fr) 410px repeat(2, 480px)'
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
                      <Stats topStats={this.state.topStats} newUserStats={this.state.newUserStats} votingStats={this.state.votingStats} />
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
                  <ReferrersChart
                    referrerCounts={this.state.referrerCounts}
                    referrerNames={this.state.referrerNames}
                  />
                  <AudienceChart
                    presentIndex={this.state.audience_present_index}
                    innerWidth={this.innerWidth}
                    data={this.state.audiencePlot}
                    labels={this.state.audienceLabels}
                    stats={this.state.audienceStats}
                  />
                  <TopPagesChart
                    topPagesCounts={this.state.topPagesCounts}
                    topPagesNames={this.state.topPagesNames}
                  />
                </>
              ) : (
                <>
                  {this.innerWidth < 700 ? (
                    <Stats mobile topStats={this.state.topStats} newUserStats={this.state.newUserStats} votingStats={this.state.votingStats} />
                  ) : (
                    <Stats topStats={this.state.topStats} newUserStats={this.state.newUserStats} votingStats={this.state.votingStats} />
                  )}
                  <LiveUsersChart
                    presentIndex={this.state.present_index}
                    innerWidth={this.innerWidth}
                    data={this.state.plot}
                    labels={this.state.labels}
                  />
                  <AudienceChart
                    presentIndex={this.state.audience_present_index}
                    innerWidth={this.innerWidth}
                    data={this.state.audiencePlot}
                    labels={this.state.audienceLabels}
                    stats={this.state.audienceStats}
                  />
                  {this.innerWidth > 700 ? (
                    <Box
                      display="grid"
                      gridTemplateColumns={this.innerWidth < 700 ? '' : '1fr 1fr'}
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
          )}*/}
      </Layout>
    );
  }
}
