import React, { Component } from 'react'
import { Text, Box } from '@chakra-ui/core'
import Layout from './Layout'

const CandidateCard = () => {
    
}

const CandidateRow = ({position, candidates}) => {
    return (
        <Text
            fontSize="xl"
            fontWeight="bold"
            color="blueGray.900"
        >
            {position}
        </Text>
    )
}

const PageHeader = () => {
    return (
        <Box
            h="80px"
            display="flex"
            flexDirection="row"
            alignItems="center"
            mb="4px"
        >
            <Text
                fontSize="2xl"
                fontWeight="bold"
                color="blueGray.900"
            >
                Candidates
            </Text>
        </Box>
    )
}

export default class Candidates extends Component {
    render() {
        return (
            <Layout>    
                <PageHeader/>
                <CandidateRow position="President" />
            </Layout>
        )
    }
}