import React, { Component } from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Icon, Link, Avatar, Text } from '@chakra-ui/core'
import firebase from "gatsby-plugin-firebase"
import { Link as GatsbyLink } from 'gatsby'

const ProfileNav = ({first, last}) => {
    return (
        <Box
            ml="59px"
            h="60px"
            display="flex"
            flexDirection="row"
            alignItems="center"
        >
            <Link href="/app/candidates">
                <Icon size="20px" color="blueGray.400" name="back"/>
            </Link>
            <Breadcrumb
                ml="40px"
                spacing="4px"
                separator={<Icon color="blueGray.400" size="18px" name="chevron-right" />}
            >
                <BreadcrumbItem>
                    <BreadcrumbLink 
                        fontSize="16px" 
                        fontWeight="600" 
                        color="blueGray.400"
                        as={GatsbyLink} 
                        to="/app/candidates">
                            Candidates
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink
                      fontSize="16px" 
                      fontWeight="600" 
                      color="blueGray.400"                        
                    >
                        {first} {last}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </Breadcrumb>
        </Box>
    )
}

const ProfileHeader = ({candidate}) => {
    return (
        <Box
            ml="120px"
            mt="12px"
            display="flex"
            flexDirection="row"
            maxWidth="40vw"
        >
            <Avatar src={candidate.photoURL} h="6.5vw" w="6.5vw" />
            <Box 
                ml="24px"
            >
                <Text lineHeight="30px" fontSize="24px" fontWeight="bold" color="blueGray.900">
                    {candidate.first} {candidate.last}
                </Text>
                <Box
                    display="flex"
                    flexDirection="row"
                    mt="4px"
                >
                    <Text color="blueGray.400" fontSize="16px" fontWeight="600" mr="12px">
                        {candidate.displayPosition}
                    </Text>
                    <Text lineHeight="24px" fontSize="20px" color="blueGray.900" mr="12px">
                        •
                    </Text>
                    <Text color="blueGray.400" fontSize="16px" fontWeight="600" >
                        Grade {candidate.grade}
                    </Text>
                </Box>
                <Text mt="4px" fontSize="16px" fontWeight="600" color="blueGray.400" lineHeight="1.3">
                    {candidate.bio}
                </Text>
            </Box>
        </Box>
    )
}

export default class Profile extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            candidateID: this.props.candidateID,
            candidate: null,
            dataLoaded: false
        }
    }

    componentDidMount() {
        console.log(this.props)
        this.getCandidate()
    }
    
    render() {
        return (
            <Box>
                {
                    !this.state.dataLoaded ? "Loading..." 
                    :
                    <>
                        <ProfileNav first={this.state.candidate.first} last={this.state.candidate.last}/>
                        <ProfileHeader candidate={this.state.candidate}/>
                    </>
                }
            </Box>
        )

    }

    getCandidate = () => {
        console.log(this.props.candidateID)
        firebase.firestore().collection("candidates").doc(this.props.candidateID.toLowerCase()).get().then(candidate => {
            this.setState({
                candidate: candidate.data(),
                dataLoaded: true
            }, () => {
                console.log(this.state)
            })
        })
    }
}