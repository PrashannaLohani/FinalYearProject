import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <Flex margin="1rem" flexWrap="wrap">
        <Box>
          <Text fontSize="2xl" as="b">
            React & Rise
          </Text>
        </Box>
        <Spacer />
        <Flex gap="1rem" flexWrap="wrap">
          <Tab />
        </Flex>
      </Flex>
      <hr />
    </>
  );
}

const Tab = () => {};
