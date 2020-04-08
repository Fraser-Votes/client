import React, { Component } from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Icon, Link } from '@chakra-ui/core'
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

const ProfileHeader = ({first, last, displayPosition, instagram, facebook, snapchat, email, grade}) => {
    return (
        <Box
            ml="120px"
        >
            Asdf
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
                        <ProfileHeader />
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