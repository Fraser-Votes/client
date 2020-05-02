import React, { Component } from 'react'
import Loadable from "@loadable/component"
import { Box, Text, Icon } from "@chakra-ui/core"

export default class AudienceChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            series: [{
                data: this.props.data
            }],
            options: {
                chart: {
                    type: 'bar',
                    toolbar: {
                        show: false
                    },
                    fontFamily: "Averta Std",
                    foreColor: "#BCCCDC",
                    zoom: {
                        enabled: false
                    }
                },
                colors: ["#2CB1BC"],
                plotOptions: {
                    bar: {
                        columnWidth: "30%",
                        distributed: true
                    }
                },
                dataLabels: {
                    enabled: false
                },
                legend: {
                    show: false
                },
                xaxis: {
                    type: 'datetime',
                    categories: this.props.labels,
                    labels: {
                        style: {
                            fontSize: '14px',
                            fontWeight: 600
                        },
                        format: "MMM dd"
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                yaxis: {
                    labels: {
                        style: {
                            fontSize: '14px',
                            fontWeight: 600,
                        },
                        offsetX: -6
                    },
                    decimalsInFloat: 0,
                    forceNiceScale: true,
                },
                grid: {
                    borderColor: '#D9E2EC',
                    strokeDashArray: 12,
                },
            }
        }
    }

    componentDidMount() {
        this.width = window.innerWidth
    }

    render() {
        return (
          <Box
            backgroundColor="white"
            borderRadius="12px"
            border="2px solid rgba(217, 226, 236, 0.55)"
            gridArea={this.width > 1500 ? " 1 / 2 / 2 / 3" : ""}
            height="100%"
            py={this.props.innerWidth > 575 ? "24px" : "32px"}
            px={this.props.innerWidth > 575 ? "60px" : "32px"}
          >
            <Box
              display="flex"
              flexDirection="column"
              height="26.5%"
              justifyContent="center"
            >
              <Text color="blueGray.500" fontSize="16px" fontWeight="600">
                Audience
              </Text>
              <Text color="blueGray.900" fontSize="24px" fontWeight="600">
                {this.props.stats[0].count}
              </Text>
              <Box display="flex" flexDirection="row" alignItems="center">
                <Icon
                  mt="2px"
                  mr="6px"
                  size="22px"
                  name={
                    this.props.stats[0].change >= 0 ? "increasing_arrow" : "decreasing_arrow"
                  }
                />
                <Box
                    display="flex"
                    flexDirection="row"
                >
                    <Text
                    fontSize="14px"
                    fontWeight="600"
                    color={this.props.stats[0].change >= 0 ? "teal.600" : "red.400"}
                    >
                    {this.props.stats[0].change}%{"\u00a0"}
                    </Text>
                    <Text fontSize="14px" color="blueGray.500" fontWeight="600">in the last 7 days</Text>
                </Box>
              </Box>
            </Box>
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width="100%"
              height="73.5%"
            />
          </Box>
        )
    }
}

const Chart = Loadable(() => import('../../../../node_modules/react-apexcharts/dist/react-apexcharts'))