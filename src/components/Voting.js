import React, { Component } from 'react'
import { Text, Box, Skeleton, Grid, Checkbox, Image, Button, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, ModalFooter, ModalHeader, useToast } from '@chakra-ui/core'
import Layout from './Layout'
import Header from './Header'
import SEO from './seo'
import firebase from "gatsby-plugin-firebase"
import { IsDesktop } from '../utils/mediaQueries'
import PlaceholderImage from "../images/placeholder.jpg"
import Helmet from 'react-helmet'
import { withPrefix } from 'gatsby'

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
            <Grid gridTemplateColumns={IsDesktop() ? "repeat(auto-fill, 310px)" : "1fr"} gridColumnGap="24px" gridRowGap="24px">
                {children}
            </Grid>
        </Box>
    )
}

const CandidateCard = ({first, last, position, photoURL, onChecked, isDisabled, currentSelection}) => {

    let currSelect = false
    currentSelection !== `${first.toLowerCase()}-${last.toLowerCase()}` ? currSelect = false : currSelect = true

    return (
        <Box
            display="flex"
            flexDirection="row"
            h="60px"
            w="100%"
            backgroundColor="white"
            borderRadius="12px"
            alignItems="center"
            boxShadow={currSelect ? "" : "0px 2.08325px 5.34398px rgba(0, 0, 0, 0.0174206), 0px 5.75991px 14.7754px rgba(0, 0, 0, 0.025), 0px 13.8677px 35.5735px rgba(0, 0, 0, 0.0325794), 0px 46px 118px rgba(0, 0, 0, 0.05);"}
        >
            <Image ml="12px" mr="20px" borderRadius="12px" w="40px" h="40px" src={photoURL} fallbackSrc={PlaceholderImage}/>
            <Text
                fontWeight="600"
                fontSize="16px"
                color="blueGray.700"
                as="a"
                href={`/app/candidates/${first.toLowerCase()}-${last.toLowerCase()}`}
            >
                {first} {last}
            </Text>
            <Checkbox 
                onChange={() => {onChecked(position, `${first.toLowerCase()}-${last.toLowerCase()}`, currSelect, first, last, photoURL)}}
                isDisabled={isDisabled && currentSelection !== `${first.toLowerCase()}-${last.toLowerCase()}`} 
                variantColor="teal" 
                ml="auto" 
                mr="12px" 
                borderRadius="12px" 
                size="lg"
            />
        </Box>
    )
}

const ModalCandidateCard = ({position, first, last, photoURL}) => {
    return (
        <Box
        display="flex"
        flexDirection="row"
        h="72px"
        w="100%"
        mb="16px"
        backgroundColor="white"
        borderRadius="12px"
        alignItems="center"
        boxShadow={"0px 2.08325px 5.34398px rgba(0, 0, 0, 0.0174206), 0px 5.75991px 14.7754px rgba(0, 0, 0, 0.025), 0px 13.8677px 35.5735px rgba(0, 0, 0, 0.0325794), 0px 46px 118px rgba(0, 0, 0, 0.05);"}
    >
        <Image ml="16px" mr="24px" borderRadius="12px" w="48px" h="48px" src={photoURL} fallbackSrc={PlaceholderImage}/>
        <Box>
            <Text
                fontWeight="600"
                fontSize="16px"
                color="blueGray.700"
            >
                {position}
            </Text>
            <Text
                fontWeight="600"
                fontSize="16px"
                color="blueGray.500"
                as="a"
                href={`/app/candidates/${first.toLowerCase()}-${last.toLowerCase()}`}
            >
                {first} {last}
            </Text>
        </Box>
    </Box>
    )
}

export default class Candidates extends Component {

    constructor(props) {
        super(props)
        this.state = {
            candidates: null,
            dataLoading:true,
            validated: false,
            voteError: false,
            voteSubmitting: false,
            voteSuccessful: false,
            votes: {
                "president": {
                    candidateID: null,
                    first: null,
                    last: null,
                    photoURL: null,
                    selected: false
                },
                "vice-president": {
                    candidateID: null,
                    first: null,
                    last: null,
                    photoURL: null,
                    selected: false
                },
                "secretary": {
                    candidateID: null,
                    first: null,
                    last: null,
                    photoURL: null,
                    selected: false
                },
                "treasurer": {
                    candidateID: null,
                    first: null,
                    last: null,
                    photoURL: null,
                    selected: false
                },
                "promotions-officer": {
                    candidateID: null,
                    first: null,
                    last: null,
                    photoURL: null,
                    selected: false
                },
                "social-convenor": {
                    candidateID: null,
                    first: null,
                    last: null,
                    photoURL: null,
                    selected: false
                }
            },
            positions: [
                // slightly janky - but for now, it works. This will be replaced with a server-side solution later
                {display: "President", raw: "president"},
                {display: "Vice President", raw:"vice-president"},
                {display: "Secretary", raw:"secretary"},
                {display: "Treasurer", raw:"treasurer"},
                {display: "Promotions Officer", raw:"promotions-officer"},
                {display: "Social Convenor", raw:"social-convenor"}
            ],
            confirmationOpen: false,
        }
    }

    componentDidMount() {
        this.getCandidates()
    }

    render() {
        return (
            <Layout>    
                <Helmet>
                    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/openpgp/4.6.2/openpgp.min.js"></script>
                </Helmet>
                <SEO title="Voting"/>
                <Header title="Voting" description="Please select the candidates that you want to vote for. "/>
                {this.state.dataLoading ? 
                    <>
                    <Skeleton borderRadius="4px" width="180px" height="30px" marginBottom="24px"/>
                    <Grid gridTemplateColumns={window.innerWidth > 960 ? "repeat(auto-fill, 310px)" : "1fr"} gridColumnGap="24px" gridRowGap="24px">
                        <Skeleton borderRadius="12px" width="100%" height="60px"/>
                        <Skeleton borderRadius="12px" width="100%" height="60px"/>
                        <Skeleton borderRadius="12px" width="100%" height="60px" marginBottom="24px"/>
                    </Grid>
                    </>
                    :
                    this.state.positions.map((position) => {
                        return ( 
                            <>
                            <CandidateRow position={position.display}>
                                {this.state["candidates"][position.raw].map(candidate => {
                                    return <CandidateCard onChecked={this.createVote} currentSelection={this.state.votes[position.raw].candidateID} isDisabled={this.state.votes[position.raw].selected} photoURL={candidate.photoURL} first={candidate.first} last={candidate.last} position={position.raw}/>
                                })}
                            </CandidateRow>
                            </>
                        )
                    })
                }
                {this.state.dataLoading ?
                    <Skeleton margin="auto" width="140px" height="48px" borderRadius="12px"/>
                :
                    <>
                    <Box width="100%" display="flex" alignItems="center">
                        <Button
                            onClick={() => this.confirmVote()}
                            margin="auto"
                            size="lg"
                            variantColor="teal"
                            borderRadius="12px"
                            px="64px"
                            py="16px"
                            marginBottom="24px"
                            isDisabled={!this.state.validated}
                        >
                            Confirm
                        </Button>
                    </Box>
                    <Modal isOpen={this.state.confirmationOpen} onClose={() => this.setState({
                        confirmationOpen: false,
                        voteError: false,
                        voteSubmitting: false,
                        voteSuccessful: false                        
                    })}>
                        <ModalOverlay/>
                        <ModalContent backgroundColor="blueGray.50" maxHeight="85vh" borderRadius="12px">
                            <ModalHeader fontWeight="bold" color="blueGray.900">
                                Confirm Your Vote
                            </ModalHeader>
                            <ModalCloseButton/>
                            <ModalBody overflowY="scroll">
                                {this.state.voteSuccessful ? 
                                    "Vote Successful"
                                :
                                    this.state.voteError ? 
                                        "Error"
                                    :
                                    this.createCandidateCards()
                                }
                            </ModalBody>
                            <ModalFooter display="flex" flexDir="row" alignItems="center" justifyContent="center">
                                <Button
                                    variantColor="primary"
                                    borderRadius="12px"
                                    px="56px"
                                    onClick={() => this.submitVote()}
                                    isLoading={this.state.voteSubmitting}
                                >
                                    Submit
                                </Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    </>
                }
            </Layout>
        )
    }

    createCandidateCards = () => {
        let cards = []

        for (this.position in this.state.votes) {
            cards.push(<ModalCandidateCard 
                            position={this.state.candidates[this.position][0]?.displayPosition}
                            first={this.state.votes[this.position].first} 
                            last={this.state.votes[this.position].last}
                            photoURL={this.state.votes[this.position].photoURL}
                        />
                      )
        }

        return cards
    }

    createVote = (position, candidateID, currentlySelected, first, last, photoURL) => {
        this.setState(prevState => ({
            votes: {
                ...prevState.votes,
                [position]: {
                    candidateID: currentlySelected ? null : candidateID,
                    first: currentlySelected ? null : first,
                    last: currentlySelected ? null : last,
                    photoURL: currentlySelected ? null : photoURL,
                    selected: !prevState.votes[position].selected
                }
            }
        }), () => {
            this.setState({
                validated: this._voteValidator()
            })
        })
    }

    confirmVote = () => {
        let votesValid = this._voteValidator()
        if (votesValid) {
            this.setState({
                confirmationOpen: true
            })
        }
    }

    _voteValidator = () => {
        for (this.position in this.state.votes) {
            if (this.state.votes[this.position].candidateID === null) {
                return false
            }
        }

        return true
    }

    encryptCandidate = async (candidateID) => {
        let openpgp = window.openpgp
        // await openpgp.initWorker({path: withPrefix('/js/openpgp.worker.min.js')})
        // firebase.storage().ref('public.asc').getDownloadURL().then((url) => {
        //     // encrypt stuff with the key
        //     console.log(url)
        // })
        const publicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
        xsBNBF6btlMBCADCO0IAmCO1bdPf6/daU2T/Bl7suB9GJ0U7RqpAAjACFoR3
        gtA4a1sBf8qQwFxKU1J/ow018YRVWDmO3nfzxpnF9vINEh9vIL+DIBZJiclC
        e9NrmEOUngXVJUdsoCExPsOYw0RBw0adcS1mfw5Go/aA6w1j0cW1+Y35gm/d
        mzatlLTrznG8kyPFsgLFkpM/e/QC5iVIVgUC/idiYZQtdlb4k61WM9qmpfAe
        ECrLFkR5CrWytLX/umRx8EUod8GMUMwsJchlt/hXSD/hJB0xg1R2NQQiJUyb
        fxPd/GrHIWj4oLbfUO9dNkzIVab04RK0tgWVLg0AnqYpiJjyYVvKdb+DABEB
        AAHNI0ZyYXNlclZvdGVzIDxoZWxsb0BmcmFzZXJ2b3Rlcy5jb20+wsB1BBAB
        CAApBQJem7ZTBgsJBwgDAgkQGCWUQz12jgoEFQgKAgMWAgECGQECGwMCHgEA
        ACOsCACWFU2AQ8OqH8Q/+4Ea7K7utfad6d/sQiNLfiTDCO5soBk05+RJ7mE2
        l4LYa5W2vGmmOACPflufv2chMUsNVSpGMxoMLZR9H9rQboJUjxX9tjlsltP6
        QCsLuWy/2ykRzIA/+tidRcXvct2VuXLyDglYXk9HIj002D2V9O9sT0J+01ID
        8/t/DNCfxD8D0/kXvbBCSuWm3GcvOrdnaqlpTWjHx/uiOA2HKzbioA5xQl7D
        CmK6SrMNgC2WU2R3ukwZ5JS+/R9NXlJGBz8rgdva5UmqKQK7af0s9RRe5SAb
        +L+jKQHalvC7yJOs0ciRPE5EHwV7PFiaVvMc37kkcHnAjyaIzsBNBF6btlMB
        CACcndCABcwx7EkjYy8uBP9EHWi6AM4ZioGHC6K0ZW5TwOjUDvH3QOFyxhqY
        EWFcqbERxyTs2dEFFOmzYBbZ6006qpf+MjnSwrb9Zk5tMQt6HodWoC/apE1t
        Twn0r6AH9c5PTHvCtqhLF8LhPL6ucSr9E3pcSx7g3arVVpbUBaOoxkS4BzeV
        rx0Nfzy0ZoUMEs/9AI3M0FBM4pznsEPbXbcCNM7IvFfegosEugzzjiTlttsq
        qou0v0sBb44hHDFLpDpEZed/UNAuH7/uIGkW7ruSJKAKwa7ViqJSh4ChNuCy
        zL0Wyb+rzA5UjNiRjThHrZmlwJdOKBY3tmYdTTEooAn3ABEBAAHCwF8EGAEI
        ABMFAl6btlMJEBgllEM9do4KAhsMAACYjAf9HAsyfzP69WNPzJv8GBZ6Kpko
        nMU8CXkofFFqCqqeSamkeLIq6mnhO3ts4T6jBexW3WPl5E9RwfdA5pltPr6K
        F3FpSxdC//m7zNnQr/jTzouS8jdmi+X5k20wvbCU0M711YES9clyHNxeDD7v
        ao7rMJnWVAW6NJyz83+aNt/EaKQBOmeXWBdNhyb53iIAgBOzRRWQ4oRnL2f8
        h2eIfrln74bSp55fpMjvvr7THxRU3YsryMh5dTEkHkW5Sp+zM67YPf8gbHqX
        2Nz9M/r/NTUudjD4yg8SA4ihlkGqSg018DaLI443sSayySWK+/cOIWGGlFDC
        Ge1OBuePFv1+D2fTJA==
        =MJhA
        -----END PGP PUBLIC KEY BLOCK-----`
        console.log(await openpgp.key.readArmored(publicKey))
        const { data: encrypted } = await openpgp.encrypt({
            message: openpgp.message.fromText(candidateID),
            publicKeys: (await openpgp.key.readArmored(publicKey)).keys,
            armor: false,
        })
        console.log(encrypted)
    }

    submitVote = () => {
        if (process.env.NODE_ENV === "development") {
            firebase.functions().useFunctionsEmulator('http://localhost:5001') 
        }
        const functions = firebase.functions()
        let addVote = functions.httpsCallable("vote")
        let parsedVotes = {}
        this.encryptCandidate("daniel-lupas")
        for (this.position in this.state.votes) {
            parsedVotes[this.position] = this.state.votes[this.position].candidateID // instead of plaintext CandidateID - give encrypted ID
        }
        this.setState({voteSubmitting: true})
        addVote({votes: parsedVotes}).then((res) => {
            console.log(res.data.voteSuccessful)
            this.setState({
                voteSuccessful: true,
                voteSubmitting: false
            })
        }).catch((err) => {
            console.error("error setting vote", err.code, err.message, err.details)
            this.setState({
                voteError: true,
                voteSubmitting: false
            })
        })

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