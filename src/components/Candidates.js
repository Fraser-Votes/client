import React, { Component } from 'react'
import { Text, Box, Image } from '@chakra-ui/core'
import Header from "./Header"
import Layout from './Layout'
import firebase from "gatsby-plugin-firebase"

const CandidateCard = ({first, last, grade, photoURL}) => {
    return (
        <Box display="flex" flexDirection="column">
            <Image src={photoURL} />
            <Box>
                <Text>{first} {last}</Text>
                <Text>Grade {grade}</Text>
            </Box>
        </Box>
    )
}

const CandidateRow = ({position, candidate}) => {
    return (
        <Text
            fontSize="xl"
            fontWeight="bold"
            color="blueGray.900"
        >
            {position} - {candidate.first} {candidate.last}
        </Text>
    )
}

export default class Candidates extends Component {

    constructor(props) {
        super(props)

        this.state = {
            candidates: null,
            dataLoading: true,
            positions: [
                {display: "President", raw: "president"},
                {display: "Vice President", raw:"vice-president"}
            ],
        }
    }

    componentDidMount() {
        getCandidates().then(candidates => {
            console.log(candidates)
            this.setState({
                candidates: candidates,
            })
            this.setState({
                dataLoading: false
            })
            console.log(this.state)
        })
    }

    render() {
        return (
            <Layout>    
                <Header title="Candidates"/>
                {this.state.dataLoading ? "Loading" : this.state.positions.map((position) => {
                    var candidates = this.state.candidates
                    return <>{candidates[position.raw].map((candidate) => {
                        return <CandidateRow position={position.display} candidate={candidate} />
                    })}</>
                })}
            </Layout>
        )
    }
}

const getCandidates = () => {
    const db = firebase.firestore()
    const candidateRef = db.collection("candidates")
    const candidates = {}

    return db.collection("positions").get().then(res => {
        console.log(res.docs)
        Promise.all(res.docs.forEach(position => {
            candidates[position.id] = []
            var positionDocRef = db.collection("positions").doc(position.id)
            return candidateRef.where("position", "==", positionDocRef).get().then(res => {
                res.forEach(doc => {
                    candidates[position.id].push(doc.data())
                })
            }).catch(err => console.log(err))
        }))
    }).then(() => candidates).catch(err => console.log(err))

}