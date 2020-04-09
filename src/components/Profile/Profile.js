import React, { Component } from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Icon, Avatar, Text, BreadcrumbSeparator } from '@chakra-ui/core'
import firebase from "gatsby-plugin-firebase"
import { Link as GatsbyLink } from 'gatsby'
import { IsDesktop } from '../../utils/mediaQueries'

const ProfileNav = ({first, last}) => {
    return (
        <Box
            ml="59px"
            h="60px"
            display="flex"
            flexDirection="row"
            alignItems="center"
        >
            <GatsbyLink to="/app/candidates">
                <Icon height="28px" size="20px" color="blueGray.400" name="back"/>
            </GatsbyLink>
            <Breadcrumb
                ml="40px"
                spacing="4px"
                addSeparator={false}
            >
                <BreadcrumbItem>
                    <BreadcrumbLink 
                        fontSize="14px" 
                        fontWeight="600" 
                        color="blueGray.400"
                        as={GatsbyLink} 
                        to="/app/candidates">
                            Candidates
                    </BreadcrumbLink>
                    <BreadcrumbSeparator h="26px">
                        <Icon color="blueGray.400" size="18px" name="chevron-right" />
                    </BreadcrumbSeparator>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink
                      fontSize="14px" 
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

    const isDesktop = IsDesktop()

    return (
        <Box
            mx={isDesktop ? "120px" : "40px"}
            mt="12px"
            display="flex"
            flexDirection={isDesktop ? "row" : "column"}
            maxWidth={isDesktop ? "775px" : "100%"} 
        >
            <Avatar src={candidate.photoURL} h="120px" w="120px" />
            <Box 
                ml={isDesktop ? "24px" : 0}
            >
                <Text lineHeight="30px" fontSize="24px" fontWeight="bold" color="blueGray.900">
                    {candidate.first} {candidate.last}
                </Text>
                <Box
                    display="flex"
                    flexDirection="row"
                    mt="4px"
                >
                    <Text color="blueGray.400" fontSize="14px" fontWeight="600" mr="12px">
                        {candidate.displayPosition}
                    </Text>
                    <Text lineHeight="20px" fontSize="20px" color="blueGray.900" mr="12px">
                        •
                    </Text>
                    <Text color="blueGray.400" fontSize="14px" fontWeight="600" >
                        Grade {candidate.grade}
                    </Text>
                </Box>
                <Text overflow="hidden" style={{textOverflow: "ellipsis"}} height={isDesktop ? "auto" : "3.9em"} mt="8px" fontSize="14px" fontWeight="600" color="blueGray.400" lineHeight="1.3em">
                    {candidate.bio}
                </Text>
                <Box mt="20px" display="flex" flexDirection="row">
                    {candidate.instagram ? 
                        <Box as="a" target="_blank" href={`https://instagram.com/${candidate.instagram}`} display="flex" alignItems="center" justifyContent="center" w="32px" h="32px" borderRadius="8px" backgroundColor="blue.50" mr="20px">
                            <Icon color="blue.500" w="20px" h="20px" name="instagram"/>
                        </Box> 
                        :
                        <></>   
                    }
                    {candidate.facebook ? 
                        <Box as="a" target="_blank" href={`https://facebook.com/${candidate.facebook}`} display="flex" alignItems="center" justifyContent="center" w="32px" h="32px" borderRadius="8px" backgroundColor="blue.50" mr="20px">
                            <Icon color="blue.500" w="8.42px" h="16px" name="facebook"/>
                        </Box> 
                        :
                        <></>   
                    }
                    {candidate.snapchat ? 
                        <Box as="a" target="_blank" href={`https://snapchat.com/add/${candidate.snapchat}`} display="flex" alignItems="center" justifyContent="center" w="32px" h="32px" borderRadius="8px" backgroundColor="yellow.100" mr="20px">
                            <Icon color="yellow.500" w="20px" h="19px" name="snapchat"/>
                        </Box> 
                        :
                        <></>   
                    }
                    {candidate.email ? 
                        <Box as="a" target="_blank" href={`mailto:${candidate.email}`} display="flex" alignItems="center" justifyContent="center" w="32px" h="32px" borderRadius="8px" backgroundColor="red.100" mr="20px">
                            <Icon color="red.500" w="20px" h="16px" name="email"/>
                        </Box> 
                        :
                        <></>   
                    }
                </Box>
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
                    <Box backgroundColor="blueGray.50" minHeight="100vh">
                        <Box backgroundColor="white" pb="36px">
                            <ProfileNav first={this.state.candidate.first} last={this.state.candidate.last}/>
                            <ProfileHeader candidate={this.state.candidate}/>
                        </Box>
                    </Box>
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