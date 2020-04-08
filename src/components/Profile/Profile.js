import React, { Component } from 'react'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Icon } from '@chakra-ui/core'
import firebase from "gatsby-plugin-firebase"
import { Link } from 'gatsby'

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
                    <Breadcrumb
                        separator={<Icon color="gray.300" name="chevron-right" />}
                    >
                        <BreadcrumbItem>
                            <BreadcrumbLink as={Link} to="/app/candidates">Candidates</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink>{this.state.candidate.first} {this.state.candidate.last}</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
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