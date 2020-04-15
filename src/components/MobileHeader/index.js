import React from "react"
import { Box, IconButton, useDisclosure, Drawer, DrawerOverlay, DrawerCloseButton, DrawerContent, DrawerBody, Text } from "@chakra-ui/core"
import Sidebar from "../Sidebar";

const MobileHeader = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Box 
                position="fixed" 
                height="44px" 
                backgroundColor="white"
                width="100vw"
                display="flex"
                flexDirection="row"
                alignItems="center"
                boxShadow="0px 10.6433px 28.4239px rgba(0, 0, 0, 0.05), 0px 85px 227px rgba(0, 0, 0, 0.1);"
            >
                <IconButton 
                    ml="4px"
                    variantColor="blueGray.700"
                    px="8px"
                    py="8px"
                    fontSize="28px"
                    icon="menu"
                    onClick={onOpen}
                    color="blueGray.700"
                />
                <Text
                    fontWeight="bold"
                    fontSize="20px"
                    color="blue.900"
                    position="relative"
                    margin="auto"
                    left="-20px"
                >
                    Fraser Votes
                </Text>
            </Box>
            <Drawer 
                isOpen={isOpen}
                onClose={onClose}
                placement="left"
                size="xs"
            >
                <DrawerOverlay/>
                <DrawerContent>
                    <DrawerCloseButton/>
                    <DrawerBody
                        px="16px"
                    >
                        <Sidebar isMobile={true}/>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default MobileHeader