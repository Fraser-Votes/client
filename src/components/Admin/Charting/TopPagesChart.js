import React, { Component } from 'react';
import Loadable from '@loadable/component';
import { Box, Text } from '@chakra-ui/core';
import './ReferrersChart.css';

export default class TopPagesChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [{
        data: this.props.topPagesCounts,
      }],
      options: {
        chart: {
          type: 'bar',
          fontFamily: 'Averta Std',
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories: this.props.topPagesNames,
          labels: {
            show: false,
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
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
        legend: {
          show: false,
        },
        colors: ['#E0FCFF'],
        dataLabels: {
          enabled: true,
          textAnchor: 'start',
          style: {
            colors: ['#0E7C86'],
          },
          offsetY: 6,
          offsetX: 6,
          formatter(val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex].replace('/app/', '').replace('candidates/', '');
          },
        },
        yaxis: {
          opposite: true,
          labels: {
            show: true,
            formatter(val) {
              return props.topPagesCounts[props.topPagesNames.indexOf(val)];
            },
            style: {
              color: ['#486581'],
              fontSize: '14px',
              fontWeight: 600,
              cssClass: 'horizontal-bar-label',
            },
            offsetX: 0,
          },
        },
        grid: {
          show: false,
          padding: {

          },
        },
        tooltip: {
          enabled: false,
        },
        noData: {
          text: 'There have been no pageviews.',
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
        gridArea={this.props.innerWidth > 1500 ? '2 / 2 / 3 / 3' : ''}
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
            Popular Pages
          </Text>
          <Text
            fontWeight="600"
            fontSize="16px"
            color="blueGray.500"
          >
            Views
          </Text>
        </Box>
        <Chart
          options={this.state.options}
          series={this.state.series}
          height="93%"
          width="100%"
          type="bar"
        />
      </Box>
    );
  }
}

const Chart = Loadable(() => import('../../../../node_modules/react-apexcharts/dist/react-apexcharts'));
