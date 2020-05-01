import React, { Component } from "react"
import Layout from "../Layout"
import { Grid, Box } from "@chakra-ui/core"

const breakpoints = [""]

export default class Dashboard extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.getQuickStats()
    }

    render() {
        return (
            <Layout>
                <Grid
                    height="100vh"
                    my="40px"
                    gridTemplateColumns={window.innerWidth  > 1500 ? "2fr 1fr" : "1fr"}
                    gridTemplateRows={window.innerWidth  > 1500 ? "repeat(2, 1fr)" : ""}
                    gridColumnGap="40px"
                    gridRowGap="40px"
                >
                    <Box
                        borderRadius="12px"
                        border="2px solid rgba(217, 226, 236, 0.55)"
                        backgroundColor="white"
                        gridArea={window.innerWidth  > 1500 ? "1 / 1 / 2 / 2" : ""}
                        width="100%"
                        height={window.innerWidth  > 1500 ? "100%" : "160px"}
                        px="36px"
                        py="36px"
                    >
                        asdf
                    </Box>
                    <Box
                        backgroundColor="white"
                        gridArea={window.innerWidth  > 1500 ? "1 / 2 / 2 / 3" : ""}
                        width="100%"
                        height="100%"
                    >
                        asdf
                    </Box>
                    <Box
                        backgroundColor="white"
                        gridArea={window.innerWidth  > 1500 ? "2 / 1 / 3 / 2" : ""}
                        width="100%"
                        height="100%"
                    >
                        asdf
                    </Box>
                    <Box
                        backgroundColor="white"
                        gridArea={window.innerWidth  > 1500 ? "2 / 2 / 3 / 3" : ""}
                        width="100%"
                        height="100%"
                    >
                        asdf
                    </Box>
                </Grid>
            </Layout>
        )
    }

    getQuickStats = () => {

        let date = new Date(Date.now())
        date = date.toISOString().split("T")[0]
        console.log(date)

        fetch(`https://plausible.io/api/stats/fraservotes.com/main-graph?period=day&date=${date}&from=undefined&to=undefined&filters=%7B%22goal%22%3Anull%7D`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-CA,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "localhost:8000",
            "referrerPolicy": "no-referrer-when-downgrade",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then((res) => {
            console.log(res)
        })
    }
}