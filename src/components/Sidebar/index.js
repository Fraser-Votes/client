import React from 'react'
import { Text, Box, Icon } from '@chakra-ui/core'
import { navigate } from 'gatsby';

const NavItem = ({title, iconName}) => {
    var isActive = null;
    window.location.pathname === `/app/${title.toLowerCase()}` ? isActive = true : isActive = false

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

const Sidebar = () => {
    return (
        <Box h="100vh" w="290px" display="flex" alignItems="center" flexDirection="column" boxShadow="0px 1px 4px rgba(0, 0, 0, 0.1)">
            <Box w="252px">
                <Text
                    fontWeight="bold"
                    fontSize="2xl"
                    color="blue.900"
                    my="22px"
                    ml="26px"
                >
                    SAC Elections
                </Text>
            </Box>
            <NavItem title="Candidates" iconName="candidates"/>
            <NavItem title="Voting" iconName="voting" />
            <NavItem title="Results" iconName="results" />
        </Box>
    )
}

export default Sidebar