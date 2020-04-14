import React, { Component } from 'react'
import { Text, Box, Skeleton } from '@chakra-ui/core'
import Layout from './Layout'
import Header from './Header'
import SEO from './seo'
import firebase from "gatsby-plugin-firebase"

export default class Candidates extends Component {

    constructor(props) {
        super(props)
        this.state = {
            candidates: null,
            dataLoading:true,
            votes: null
        }
    }

    componentDidMount() {
        this.getCandidates()
    }

    render() {
        return (
            <Layout>    
                <SEO title="Voting"/>
                <Header title="Voting" description="Please select the candidate that you want to vote for. "/>
                {this.state.dataLoading ? 
                    <>
                    <Skeleton borderRadius="4px" width="180px" height="30px" marginBottom="24px"/>
                    <Box display="flex" flexDirection="row">
                        <Skeleton borderRadius="12px" width="320px" mr="16px" height="60px"/>
                        <Skeleton borderRadius="12px" width="320px" mr="16px" height="60px"/>
                        <Skeleton borderRadius="12px" width="320px" height="60px"/>
                    </Box>
                    </>
                    :
                    <Text>asdf</Text>
                }

            </Layout>
        )
    }

    getCandidates = async () => {
        const db = firebase.firestore()
        const candidateRef = db.collection("candidates")
        const candidates = {}
    
        db.collection("positions").get().then(res => {
            res.docs.forEach(position => {
                candidates[position.id] = []
                var positionDocRef = db.collection("positions").doc(position.id)
                candidateRef.where("position", "==", positionDocRef).get().then(res => {
                    res.forEach(doc => {
                        candidates[position.id].push(doc.data())
                    })
                }).catch(err => console.log(err))
            })
        }).then(() => {
            this.setState({
                candidates: candidates,                
            },() => {
                // pretend this doesn't exist
                setTimeout(() => {this.setState({dataLoading: false})}, 700)
            })
        })    
        return true
    }
}