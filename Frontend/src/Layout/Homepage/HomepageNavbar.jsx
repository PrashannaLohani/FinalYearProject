import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import Login from "../../Pages/Login";
import Signup from "../../Pages/Signup";

export default function HomepageNav() {
  return (
    <Flex margin="1rem" flexWrap="wrap">
      <Box>
        <Text fontSize="2xl" as="b">
          React & Rise
        </Text>
      </Box>
      <Spacer />
      <Flex gap="1rem" flexWrap="wrap">
        <NavLink to="/Login" element={<Login />}>
          <Button
            colorScheme="blackAlpha"
            borderRadius="8"
            backgroundColor="black"
          >
            Login
          </Button>
        </NavLink>
        <NavLink to="/Signup" element={<Signup />}>
          <Button variant="ghost" borderRadius="8">
            Signup
          </Button>
        </NavLink>
      </Flex>
    </Flex>
  );
}
