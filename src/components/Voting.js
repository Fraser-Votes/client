import React, { Component } from 'react'
import { Text, Box } from '@chakra-ui/core'
import Layout from './Layout'
import Header from './Header'
import SEO from './seo'

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
                <SEO title="Voting"/>
                <Header title="Voting"/>
                
            </Layout>
        )
    }
}