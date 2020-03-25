import React from "react"
import { Box, Text } from "@chakra-ui/core"

const Header = ({title}) => {
  return (
      <Box
          h="76px"
          display="flex"
          flexDirection="row"
          alignItems="center"
          mb="4px"
      >
          <Text
              fontSize="2xl"
              fontWeight="bold"
              color="blueGray.900"
          >
              {title}
          </Text>
      </Box>
  )
}

export default Header