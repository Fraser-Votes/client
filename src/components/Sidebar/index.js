import React from 'react'
import { Text, Box, Icon, MenuButton, Menu, MenuList, MenuItem, Avatar } from '@chakra-ui/core'
import { navigate } from 'gatsby';
import { getUser, logout } from '../../utils/auth';
import firebase from "gatsby-plugin-firebase"

const NavItem = ({title, iconName}) => {
    var isActive = null;
    window.location.pathname === `/app/${title.toLowerCase()}` || (window.location.pathname === "/app" || window.location.pathname === "/app/") && title === "Candidates" ? isActive = true : isActive = false

    return (
        <Box 
            as="button"
            h="38px" 
            w="242px"
            textAlign="center"
            backgroundColor={isActive ? "blue.50" : ""} 
            mb="16px"
            display="flex"
            justifyContent="stretch"
            alignItems="center"
            px="20px"
            borderRadius="8px"
            onClick={() => {
                navigate(`/app/${title.toLowerCase()}`)
            }}
        >
            <Icon 
                color={isActive ? "blue.700" : "blueGray.500"} 
                w={iconName === "candidates" ? "23.33px" : iconName=== "results" ? "18px" : "18px"} 
                h={iconName === "candidates" ? "18.67px" : iconName=== "results" ? "16px" : "18px"}
                mt={iconName !== "candidates" ? "4px" : 0}
                ml={iconName !== "candidates" ? "4px" : 0}
                name={iconName}
            />
            <Text
                ml= {iconName=== "candidates" ? "35px" : "37px"}
                lineHeight="38px"
                fontWeight="bold"
                color= {isActive ? "blue.700" : "blueGray.500"}
                fontSize="16px"
            >
                {title}
            </Text>
        </Box>
    )
}

const ProfileBar = () => {
    const user = getUser()

    return (
        <Menu>
            <MenuButton py="16px" display="flex" flexDirection="row" justifyContent="center" alignItems="center" width="100%">
                <Avatar name={user.displayName} ml="34px" size="sm" src={user.photoURL}/>
                <Box ml="12px" textAlign="left">
                    <Text mb="2px" lineHeight="14px" mr="14px" fontSize="sm" maxWidth="144px" isTruncated fontWeight="bold" color="blue.700">
                        {user.displayName}
                    </Text>
                    <Text mt="2px" lineHeight="0.875rem" fontSize="sm" color="gray.600" fontWeight="600">
                        {user.email.split("@")[0]}
                    </Text>
                </Box>
                <Icon size="20px" color="blue.900" mr="35px" name="chevron-down"/>
            </MenuButton>
            <MenuList borderRadius="8px">
                <MenuItem fontWeight="600" color="blueGray.900" as="button" onClick={() => logout(firebase)}>
                    Log out
                </MenuItem>
            </MenuList>
        </Menu>
   )
}

const Sidebar = ({isMobile}) => {
    return (
    <Box h="100vh" w="290px" display="flex" alignItems="center" justifyContent="space-between" flexDirection="column" boxShadow={isMobile ? "" : "0px 1px 4px rgba(0, 0, 0, 0.1)"}>
            <Box
                textAlign="center"
            >
                <Box>
                    <Text
                        fontWeight="bold"
                        fontSize="2xl"
                        color="blue.900"
                        my="20px"
                    >
                        Fraser Votes
                    </Text>
                </Box>
                <NavItem title="Candidates" iconName="candidates"/>
                <NavItem title="Voting" iconName="voting" />
                <NavItem title="Results" iconName="results" />
            </Box>
            <Box w="100%">
                <ProfileBar/>
            </Box>
        </Box>
    )
}

export default Sidebar