import React, { Component } from 'react';
import Loadable from '@loadable/component';
import { Box, Text } from '@chakra-ui/core';
import './ReferrersChart.css';

export default class ResultsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [{
        data: this.props.results.map((result) => result.count),
      }],
      options: {
        chart: {
          type: 'bar',
          fontFamily: 'Averta Std',
          toolbar: { show: false },
        },
        xaxis: {
          categories: this.props.results.map((result) => result.name),
        },
        plotOptions: {
          bar: {
            barHeight: '47%',
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: 'bottom',
            },
          },
        },
        legend: { show: false },
        colors: ['#DCEEFB'],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: { colors: ['#486581'] },
        },
        yaxis: {
          opposite: true,
          labels: {
            show: true,
            style: {
              color: ['#486581'],
              fontSize: '14px',
              fontWeight: 600,
              cssClass: 'horizontal-bar-label',
            },
            offsetX: 0,
          },
        },
        grid: { show: false },
        tooltip: { enabled: false },
        noData: {
          text: 'No results have been recorded.',
          style: {
            color: '#BCCCDC',
            fontSize: '16px',
          },
        },
      },
    };
  }

  render() {
    return (
      <Box
        backgroundColor="white"
        borderRadius="12px"
        border="2px solid rgba(217, 226, 236, 0.55)"
        width="100%"
        height="100%"
        py="36px"
        px="36px"
      >
        <Box
          display="flex"
          width="100%"
          flexDirection="row"
          justifyContent="space-between"
        >
          <Text
            fontWeight="600"
            fontSize="16px"
            color="blueGray.500"
          >
            {this.props.position}
          </Text>
          <Text
            fontWeight="600"
            fontSize="16px"
            color="blueGray.500"
          >
            Votes
          </Text>
        </Box>
        <Chart ref={this.chartRef} options={this.state.options} series={this.state.series} height="93%" width="100%" type="bar" />
      </Box>
    );
  }
}

const Chart = Loadable(() => import('../../../../node_modules/react-apexcharts/dist/react-apexcharts'));
