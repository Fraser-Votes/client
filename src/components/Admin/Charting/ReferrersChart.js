import React, { Component } from 'react'
import Loadable from '@loadable/component'
import { Box, Text } from '@chakra-ui/core'

export default class ReferrersChart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            series: [{
                data: this.props.referrerCounts
            }],
            options: {
                chart: {
                    type: 'bar',
                    fontFamily: "Averta Std",
                    toolbar: {
                        show: false
                    }
                },
                xaxis: {
                    categories: this.props.referrerNames,
                    labels: {
                        show: false
                    },
                    axisBorder: {
                        show: false
                    },
                    axisTicks: {
                        show: false
                    }
                },
                plotOptions: {
                    bar: {
                        barHeight: "47%",
                        distributed: true,
                        horizontal: true,
                        dataLabels: {
                            position: 'bottom'
                        }
                    }
                },
                legend: {
                    show: false
                },
                colors: ['#DCEEFB'],
                dataLabels: {
                    enabled: true,
                    textAnchor: 'start',
                    style: {
                        colors: ["#486581"]
                    },
                    offsetY: 6,
                    offsetX: 6,
                    formatter: function (val, opt) {
                        return opt.w.globals.labels[opt.dataPointIndex]
                    }
                },
                yaxis: {
                    opposite: true,
                    labels: {
                        show: true,
                        formatter: function (val, index) {
                            return props.referrerCounts[props.referrerNames.indexOf(val)]
                        },
                        style: {
                            color: ["#486581"],
                            fontSize: "14px",
                            fontWeight: 600,
                            cssClass: "horizontal-bar-label",
                        },
                        offsetX: 0
                    },
                },
                grid: {
                    show: false,
                    padding: {
                        
                    }
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    }

    render() {
        return (
            <Box
            backgroundColor="white"
            borderRadius="12px"
            border="2px solid rgba(217, 226, 236, 0.55)"
            gridArea={this.props.innerWidth > 1500 ? "1 / 2 / 2 / 3 " : ""}
            width="100%"
            height="100%"
            py="36px"
            px="36px"
          > 
            <Text
                fontWeight="600"
                fontSize="16px"
                color="blueGray.500"
            >
                Top Referrers
            </Text>
            <Chart options={this.state.options} series={this.state.series} height="90%" width="100%" type="bar"/>
          </Box>
        )
    }
}

const Chart = Loadable(() => import('../../../../node_modules/react-apexcharts/dist/react-apexcharts'))