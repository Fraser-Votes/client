import React, { Component } from 'react'
import { Text, Box, Image, Icon } from '@chakra-ui/core'
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

const CandidateRow = ({position, children}) => {
    return (
        <Box>
            <Text
                fontSize="xl"
                fontWeight="bold"
                color="blueGray.900"
            >
                {position}
            </Text>
            <Box>
                {children}
            </Box>
        </Box>
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
        this.getCandidates()
    }

    render() {
        return (
            <Layout>    
                <Header title="Candidates"/>
                {this.state.dataLoading ? "Loading" : this.state.positions.map((position) => {
                    return <CandidateRow position={position.display}>
                        {this.state["candidates"][position.raw].map(candidate => {
                            return <CandidateCard first={candidate.first} last={candidate.last} grade={candidate.grade} photoURL={candidate.photoURL} />
                        })}
                    </CandidateRow>
                })}
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
                setTimeout(() => {this.setState({dataLoading: false})}, 500)
            })
        })    
        return true
    }
}