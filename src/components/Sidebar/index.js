import React from 'react'
import { Text, Box, Icon } from '@chakra-ui/core'
import { navigate } from 'gatsby';

const NavItem = ({title, iconName}) => {
    var isActive = null;
    window.location.pathname === `/app/${title.toLowerCase()}` ? isActive = true : isActive = false

    return (
        <Box 
            as="button"
            h="40px" 
            w="272px"
            textAlign="center"
            backgroundColor={isActive ? "blue.50" : ""} 
            mb="18px"
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
                name={iconName}
            />
            <Text
                ml= {iconName=== "candidates" ? "52px" : "56px"}
                lineHeight="40px"
                fontWeight="bold"
                color= {isActive ? "blue.700" : "blueGray.500"}
                fontSize="16px"
            >
                {title}
            </Text>
        </Box>
    )
}

const Sidebar = () => {
    return (
        <Box w="320px">
            <NavItem title="Candidates" iconName="candidates"/>
            <NavItem title="Voting" iconName="voting" />
            <NavItem title="Results" iconName="results" />
        </Box>
    )
}

export default Sidebar