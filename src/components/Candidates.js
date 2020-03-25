import React, { Component } from 'react'
import { Text, Box } from '@chakra-ui/core'
import Header from "./Header"
import Layout from './Layout'

const CandidateCard = ({name, grade, position, id}) => {
        
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
export default class Candidates extends Component {

    render() {
        return (
            <Layout>    
                <Header title="Candidates"/>
                <CandidateRow position="President" />
            </Layout>
        )
    }
}