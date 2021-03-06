import React, { Component } from 'react';
import { Box, Text } from '@chakra-ui/core';
import Loadable from '@loadable/component';
import './Tooltip.css';

// takes labels, presentIndex, and data props for the actual graph
export default class LiveUsersChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [{
        name: 'Live Users',
        data: props.data.splice(props.presentIndex - 5, props.presentIndex + 1),
      }],
      options: {
        chart: {
          type: 'area',
          height: '280',
          toolbar: {
            show: false,
            tools: {
              download: false,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
            },
          },
          fontFamily: 'Averta Std',
          foreColor: '#BCCCDC',
          zoom: { enabled: false },
        },
        xaxis: {
          type: 'datetime',
          categories: props.labels.splice(props.presentIndex - 5, props.presentIndex + 1),
          labels: {
            formatter(val, timestamp) {
              const date = new Date(timestamp);
              return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                .replace('PM', 'pm')
                .replace('AM', 'am')
                .replace(/^0+/, '');
            },
            style: {
              fontSize: '14px',
              fontWeight: 600,
            },
            offsetX: 4,
          },
          axisBorder: { show: false },
          axisTicks: { show: false },
          tooltip: { enabled: false },
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '14px',
              fontWeight: 600,
            },
            offsetX: -6,
          },
          tooltip: { enabled: false },
          decimalsInFloat: 0,
          forceNiceScale: true,
        },
        grid: {
          borderColor: '#D9E2EC',
          strokeDashArray: 12,
          padding: {
            left: 12,
          },
        },
        colors: ['#4098D7'],
        dataLabels: { enabled: false },
        fill: {
          colors: ['#109CF1'],
          gradient: {
            type: 'vertical',
            gradientToColors: ['rgba(255,255,255,0.1)'],
          },
        },
        stroke: { width: 2.5 },
        tooltip: {},
      },
    };
  }

  render() {
    return (
      <Box
        backgroundColor="white"
        borderRadius="12px"
        border="2px solid rgba(217, 226, 236, 0.55)"
        gridArea={this.props.innerWidth > 1500 ? '1 / 2 / 2 / 3' : ''}
        height="100%"
        py={this.props.innerWidth > 575 ? '24px' : '32px'}
        px={this.props.innerWidth > 575 ? '60px' : '32px'}
      >
        <Text
          fontSize="16px"
          fontWeight="600"
          color="blueGray.500"
        >
          Live Users
        </Text>
        <Chart
          options={this.state.options}
          series={this.state.series}
          height="90%"
          width="100%"
          type="area"
        />
      </Box>
    );
  }
}

const Chart = Loadable(() => import('../../../../node_modules/react-apexcharts/dist/react-apexcharts'));
