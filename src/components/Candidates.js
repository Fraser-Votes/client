import React, { Component } from 'react'
import { Text, Box, Image, Icon, Grid, Divider } from '@chakra-ui/core'
import Header from "./Header"
import Layout from './Layout'
import firebase from "gatsby-plugin-firebase"
import { navigate } from 'gatsby'
import { IsDesktop } from '../utils/mediaQueries'

const CandidateCard = ({first, last, grade, photoURL}) => {
    return (
        <Box 
        background="white" 
        overflow="hidden" 
        borderRadius="16px" 
        width="100%" 
        mb={IsDesktop() ? 0 : "32px"}
        display="flex" 
        flexDirection="column"
        boxShadow="0px -0.193708px 3.7358px rgba(0, 0, 0, 0.0112458), 0px -0.465507px 8.97764px rgba(0, 0, 0, 0.0161557), 0px -0.876509px 16.9041px rgba(0, 0, 0, 0.02), 0px -1.56354px 30.154px rgba(0, 0, 0, 0.0238443), 0px -2.92443px 56.3998px rgba(0, 0, 0, 0.0287542), 0px -7px 135px rgba(0, 0, 0, 0.04);"
        >
            <Image fallbackSrc="https://via.placeholder.com/500" objectFit="cover" h={IsDesktop() ? "130px" : "30vh"} w="100%" src={photoURL} />
            <Box 
                alignItems="center" 
                mx="14px" 
                justifyContent="space-between" 
                h="35px" 
                flexDirection="row" 
                display="flex"
            >
                <Text fontWeight="bold" fontSize="14px" color="blueGray.800">{first} {last}</Text>
                <Text fontWeight="bold" fontSize="12px" color="blueGray.500">Grade {grade}</Text>
            </Box>
            <Divider my="0px" color="#F0F4F8" borderWidth="1.5px"/>
            <Box 
                as="button" 
                onClick={() => {navigate(`/app/candidates/${first}-${last}`)}} 
                px="14px" 
                display="flex" 
                flexDirection="row" 
                alignItems="center" 
                h="35px"
            >
                <Text fontWeight="bold" fontSize="12px" color="blue.800">View Profile</Text>
                <Icon ml="8px" color="blue.800" name="forward" />
            </Box>
        </Box>
    )
}

const CandidateRow = ({position, children}) => {
    return (
        <Box mb="32px">
            <Text
                fontSize="xl"
                fontWeight="bold"
                color="blueGray.900"
                mb="18px"
            >
                {position}
            </Text>
            <Grid gridTemplateColumns={IsDesktop() ? "repeat(auto-fill, 210px)" : "1fr"} gridColumnGap="40px">
                {children}
            </Grid>
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
                // slightly ghetto - but for now, it works. This will be replaced with a server-side solution later
                {display: "President", raw: "president"},
                {display: "Vice President", raw:"vice-president"},
                {display: "Secretary", raw:"secretary"},
                {display: "Treasurer", raw:"treasurer"},
                {display: "Promotions Officer", raw:"promotions-officer"},
                {display: "Social Convenor", raw:"social-convenor"}
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
                // pretend this doesn't exist
                setTimeout(() => {this.setState({dataLoading: false})}, 500)
            })
        })    
        return true
    }
}