import React, { Component } from 'react'
import { Text, Box } from '@chakra-ui/core'
import Header from "./Header"
import Layout from './Layout'
import firebase from "gatsby-plugin-firebase"

const db = firebase.firestore()
const candidateRef = db.collection("candidates")

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

    constuctor(props) {
        super(props)

        this.state = {
            candidates: null,
            dataLoading: false
        }

    }

    async componentDidMount() {
        const candidates = await getCandidates()
        this.setState({
            candidates: candidates
        })
        console.log(this.state.candidates)
    }

    createCandidateRows = () => {
        this.state.candidates.forEach(position => {
            return <CandidateRow position={position.key()}/>
        })
    }


    render() {
        return (
            <Layout>    
                <Header title="Candidates"/>
                {this.createCandidateRows()}
            </Layout>
        )
    }
}

const getCandidates = () => {

    var candidates = {}

    db.collection("positions").get().then(res => {
        res.forEach(position => {
            candidates[position.id] = []
            var positionDocRef = db.collection("positions").doc(position.id)
            candidateRef.where("position", "==", positionDocRef).get().then(res => {
                res.forEach(doc => {
                    candidates[position.id].push(doc.data())
                })
            }).catch(err => console.log(err)) 
        })
    })

    return candidates
}
