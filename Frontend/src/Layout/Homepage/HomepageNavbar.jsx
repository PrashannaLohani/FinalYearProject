import { Box, Button, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import Login from "../../Pages/Login";
import Signup from "../../Pages/Signup";
import Home from "../../Pages/Home";

export default function HomepageNav() {
  return (
    <Flex margin="1rem" flexWrap="wrap" alignItems="center">
      <NavLink to="/" element={<Home />}>
        <Box display="flex" alignItems="center">
          <Image
            width="100%"
            height="50px"
            objectFit="cover"
            src="./Image/React&Rise_Logo.png"
          />
          <Image
            width="100%"
            height="40px"
            objectFit="cover"
            src="./Image/React&Rise_Text.png"
          />
        </Box>
      </NavLink>
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
