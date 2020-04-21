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

const ToastContext = React.createContext(() => {})

function ToastProvider({children}) {
    const toast = useToast()
    return (
        <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
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
            <ToastProvider>
                <Layout>    
                    <Helmet>
                        <script defer src={withPrefix("../js/openpgp.min.js")}></script>
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
                        <ToastContext.Consumer>
                            {toast => (
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
                                            {this.createCandidateCards()}
                                        </ModalBody>
                                        <ModalFooter display="flex" flexDir="row" alignItems="center" justifyContent="center">
                                            <Button
                                                variantColor="primary"
                                                borderRadius="12px"
                                                px="56px"
                                                onClick={() => this.submitVote(toast)}
                                                isLoading={this.state.voteSubmitting}
                                            >
                                                Submit
                                            </Button>
                                        </ModalFooter>
                                    </ModalContent>
                            </Modal>
                            )}
                        </ToastContext.Consumer>
                        </>
                    }
                </Layout>
            </ToastProvider>
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
        await openpgp.initWorker({path: withPrefix("../js/openpgp.worker.min.js")})
        // firebase.storage().ref('public.asc').getDownloadURL().then((url) => {
        //     // encrypt stuff with the key
        //     console.log(url)
        // })
        const publicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
        Version: OpenPGP.js v4.6.2
        Comment: https://openpgpjs.org
        
        xsBNBF6c4EkBCAC3io7lVTPpEBSjllEmZtIyKlw270M+9nwqwJRrysGfQRGf
        Hd8YC9daIMHHEdTXiB5aPnDxT0l2Lj5wDHuTPnQEXlNq/RtBvfTHKC7tmNwy
        a3cwq6seS37+mE3+0AUz+eu3mBVX7Sdoe6jhCJFpk7fl1l0W3YtV45p8KXWI
        H3eyZBh9Uz2hoThaSkTkmoklwHxEU8p5zLy9JsiiD3MN1+uC6nDXhRBF4vZj
        f6MJzorLZ1EgnuJaUqAQkNyIe+lA8lWyJgVOGy6ajmxWHdJDHR4fR8jN0se1
        FYUhR8aG/8EFoGOmxqoLHRmt2iL54rVWywvpn/+YZ2nQfy4qJ1kTMNLTABEB
        AAHNJEZyYXNlciBWb3RlcyA8aGVsbG9AZnJhc2Vydm90ZXMuY29tPsLAdQQQ
        AQgAHwUCXpzgSQYLCQcIAwIEFQgKAgMWAgECGQECGwMCHgEACgkQXllJlPM0
        LN7Z4wf9GU8U8dvx5wXjrz3e+xdG1qo2iI8aDSuifezFIcA2+1FlRnCASE8In
        FkTGiebyxTE7EZVvnagY61DHWrZnQ5A7qiuHOtv9sUcJGMRPjWVVLyGAzqrp
        LsJGCyz0F9kAPuVx46HA+OJiFhQbFX1y+JvJq4o/XoE7tkh4cSd/iT9lhALl
        /7SIAbplxjqRXBgQdrOKvmbeNdvhEDQQnvGa1wfCEEHM0qWtSwCheYUsgzPN
        u63RyVVLsl6zMHmZqvZzon35s2CdDcXeR6ktct4XQ4LmYnTwuylPlzgJXMGu
        yW7lgWi/BhRVYVKAlhDaZJsxFuQEMOr1BXIj3irLFgXIi9YeFc7ATQRenOBJ
        AQgA6JG3PPUEoCp+IsiJG4nR1Z4/74cA4gDCNUBmRKyGXYknZw+JM1BWOmmL
        yOQF8OpabzzBQ58I+sI3NI3F9ckMlR0y+Tyu79isqL6V58T7vDWJRDvWaK1E
        101tm3jodHYbjzBIsA3uzFzFH0XwZn10CgNoPTju1rITKk46gdY4YYKAgy4p
        AKXPvSIrGZ6letC6BQ3UOdM0MWR9wmqiaApzrav8s2RlVuRR63efjOWfWNN7
        /wlsf9G5NW9pf+EctFi1HITJbfMNXPJKGOB26lhFxO25M8oe0yeAvs9DQSg8
        GD3qDfRPyotOeI9ly43Vru516A7DK7ABiAPkYtJqHrQ/YwARAQABwsBfBBgB
        CAAJBQJenOBJAhsMAAoJEF5ZSZTzNCzeLe8H/0Wgwt+61wwygekevrtjjN0F
        pTHNlk8KYmR+WdGChI22eMatXYMyo2oJAPBd+IeH57LxJRNl7YqzJD2sZBr3
        jnud6QFipdGhFzdMt7jDOVuTBNr7VbN5v6G7YAPX5ZtiJ3PpteZy7fODQ9S1
        wdddgQkQLAN1Jp+8qVwtBVBY45ar9T5eI7hiaZHqfvpLKyzySYmwzZ704O/r
        5V/tjZgaIInizOT/rlevPUVbsqkGGJ2RN6km+DJsEDx85Hu8PwsJbhYtbNHf
        SAc6OudQ00HALYnMYeoRKI/VO7YsFDRl6c+Oyh+5Ezz719NUKcLy0aJuvCTH
        xLdERR5YZ2sz7Dltfb8=
        =Pwpw
        -----END PGP PUBLIC KEY BLOCK-----`
        const { data: encrypted } = await openpgp.encrypt({
            message: openpgp.message.fromText('Hello World'),
            publicKeys: openpgp.key.readArmored(publicKey).keys,
        })
        console.log(encrypted)
    }   

    submitVote = (toast) => {
        if (process.env.NODE_ENV === "development") {
            // firebase.functions().useFunctionsEmulator('http://localhost:5001') 
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
                voteSubmitting: false,
                confirmationOpen: false
            })
            toast({
                title: "Vote Submitted",
                description: "Thanks for voting!",
                status: "success",
                duration: 10000,
                isClosable: true
            })
        }).catch((err) => {
            console.error("error setting vote", err.code, err.message, err.details)
            this.setState({
                voteError: true,
                voteSubmitting: false,
                confirmationOpen: false
            })
            toast({
                title: "An error occurred",
                description: "There was an error submitting your vote. Please try again.",
                status: "error",
                duration: 10000,
                isClosable: true
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