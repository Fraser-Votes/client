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
        const candidates = getCandidates()
        this.setState({
            candidates: candidates,
        })
        this.setState({
            dataLoading: false
        })
        console.log(this.state)   
    }

    render() {
        return (
            <Layout>    
                <Header title="Candidates"/>
                {this.state.dataLoading ? "Loading" : this.state.positions.map((position) => {
                    var candidates = this.state.candidates
                    console.log(candidates)
                    candidates[position.raw].map((candidate) => {
                        console.log(candidate)
                        return <CandidateRow position={position.display}/>
                    })
                })}
            </Layout>
        )
    }
}

const getCandidates = () => {

    const candidates = {}

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