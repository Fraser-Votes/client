import React, { Component } from 'react'
import { Text, Box } from '@chakra-ui/core'
import Layout from './Layout'
import Header from './Header'

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

export default class Candidates extends Component {
    render() {
        return (
            <Layout>    
                <Header title="Voting"/>
                <CandidateRow position="President" />
            </Layout>
        )
    }
}